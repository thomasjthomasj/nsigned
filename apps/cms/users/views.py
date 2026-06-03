import jwt
import json
from datetime import timezone
from django.apps import apps
from django.db import transaction
from django.core.cache import cache
from django.core.validators import validate_email
from datetime import datetime, timezone
from django.core.exceptions import PermissionDenied, ValidationError
from app.decorators import method, logged_in, logged_out, cached
from app.http import Ok, NotFound, BadRequest, Unauthorized, InternalServerError
from app.utils import get_cache_key, set_auth_cookie, parse_markdown, delete_auth_cookies, delete_cache
from links.models import Link
from .auth import issue_tokens, decode
from .email import send_otp, send_article_notifications, send_consent_emails, EmailError
from .models import User, Notification
from .validators import fundraiser_link_validator
from .utils import get_otp

@logged_in()
def get_me(request):
  user = request.site_user
  return Ok(user.serialized | { "email": user.email, "bio": user.bio })

@cached("USER", id_kwarg="username")
def get_user(request, username):
  try:
    user = User.objects.select_related("fundraiser_link").get(username=username)
    return Ok(user.serialized | {"bio": parse_markdown(user.bio)})
  except User.DoesNotExist:
    return NotFound()

@method("GET")
def exists(request):
  kwargs = {}
  email = request.GET.get("email")
  username = request.GET.get("username")
  if not email and not username:
    return BadRequest("No `email` or `username` submitted")

  if email:
    try:
      validate_email(email)
    except ValidationError:
      return BadRequest("Email is not valid")
    kwargs["email"] = email

  if username:
    kwargs["username"] = username

  return Ok({
    "user_exists": User.objects.filter(**kwargs).exists(),
  })

@method("POST")
@logged_in()
@transaction.atomic()
def update(request):
  user = request.site_user
  data = request.json
  display_name = data.get("display_name")
  bio = data.get("bio")
  fundraiser_link = data.get("fundraiser_link")
  if fundraiser_link:
    try:
      fundraiser_link_validator(fundraiser_link)
    except ValidationError:
      return BadRequest("Fundraiser link is not supported")
    user.fundraiser_link = Link.objects.get_or_create(url=fundraiser_link)[0]
  if display_name:
    user.display_name = display_name
  if bio:
    user.bio = bio
  user.save()
  delete_cache("USER", id_val=user.username)
  return Ok(user.serialized)

@method("POST")
@logged_out()
def request_otp(request):
  data = request.json
  username_or_email = data["username_or_email"]
  if not username_or_email:
    return BadRequest("Must provide `username_or_email`")
  user = None
  for field in ("username", "email"):
    try:
      kwargs = { field: username_or_email }
      user = User.objects.get(**kwargs)
    except User.DoesNotExist:
      pass
  if not user:
    return BadRequest()

  otp = user.update_otp()
  result = send_otp(user, otp)
  if result.status_code != 200:
    return InternalServerError(user.email)
  return Ok({ "action": "otp_sent" })

@method("POST")
@logged_out()
def register(request):
  required = ["email", "username"]
  data = request.json

  for field in required:
    if not data.get(field):
      return BadRequest(f"Missing `%s` field" % field)

  email = data.get("email")
  username = data.get("username")
  display_name = data.get("display_name", username)

  email_exists = User.objects.filter(email=email).exists()
  if email_exists:
    return BadRequest("User with this email already exists")

  username_exists = User.objects.filter(username=username).exists()
  if username_exists:
    return BadRequest("This username is taken")

  try:
    with transaction.atomic():
      user = User.objects.create_user(
        username=username,
        email=email,
        password=get_otp(),
        password_expiry=datetime.now(timezone.utc),
        display_name=display_name,
        last_login=datetime.now(timezone.utc)
      )
      otp = user.update_otp()
      response = send_otp(user, otp)
      if not response.ok:
        raise EmailError()
  except EmailError:
    return InternalServerError("Could not send OTP")
  return Ok()

@method("POST")
@logged_out()
def login(request):
  data = request.json
  username_or_email = data.get("username_or_email")
  password = data.get("password")
  try:
    user = User.objects.authenticate(username_or_email=username_or_email, password=password)
  except PermissionDenied:
    return Unauthorized("Incorrect login details, please check and try again.")
  if user.password_expiry < datetime.now(timezone.utc):
    return Unauthorized("One-time password is no longer valid.")

  user.last_login = datetime.now(timezone.utc)
  user.password_expiry = datetime.now(timezone.utc)
  user.save()

  tokens = issue_tokens(user)
  response = Ok()
  set_auth_cookie(response, "access-token", tokens["access"])
  set_auth_cookie(response, "refresh-token", tokens["refresh"])

  return response

@method("POST")
@logged_in()
def logout(request):
  response = Ok()
  delete_auth_cookies(response)
  return response

@method("POST")
def refresh_token(request):
  refresh_token = request.COOKIES.get("refresh-token")
  if not refresh_token:
    return Unauthorized("No refresh token")

  try:
    payload = decode(refresh_token)
  except jwt.InvalidTokenError:
    return Unauthorized("Invalid refresh token")

  if payload.get("type") != "refresh":
    return Unauthorized("Invalid token type")

  try:
    user = User.objects.get(id=payload["user_id"])
  except User.DoesNotExist:
    return NotFound()

  tokens = issue_tokens(user)
  response = Ok()
  set_auth_cookie(response, "access-token", tokens["access"])
  set_auth_cookie(response, "refresh-token", tokens["refresh"])

  return response

@method("POST")
@logged_out()
@transaction.atomic()
def email_consent(request):
  data = request.json.get("nsigned.com", {})
  granted = data.get("granted", [])
  denied = data.get("denied", [])
  granted_users = User.objects.filter(email__in=granted)
  granted_users.update(can_email=True)

  ReviewRequest = apps.get_model("music", "ReviewRequest")
  review_requests = ReviewRequest.objects.filter(
    created_by__in=granted_users,
    notified=False,
    notify_on_review=True
  ).exclude(article=None)
  send_article_notifications(review_requests)
  review_requests.update(notified=True)

  User.objects.filter(email__in=denied).update(can_email=False)

  return Ok()

@method("POST")
@logged_out()
def send_email_consent(request):
  email = request.json.get("email")
  send_consent_emails(emails=[email])
  return Ok()

@method("GET")
@logged_in()
def notifications(request):
  user = request.site_user
  cache_key = get_cache_key("NOTIFICATIONS", id_val=user.id)
  cached_body = cache.get(cache_key)
  if cached_body:
    return Ok(json.loads(cached_body))

  notifications = Notification.objects.select_related("user").filter(
    user=user,
    read=False,
  ).order_by("-created_at")

  notification_data = [notification.serialized for notification in notifications]
  cache.set(cache_key, json.dumps(notification_data), timeout=3600)

  return Ok([notification.serialized for notification in notifications])

@method("POST")
@logged_in()
def mark_notifications_read(request):
  user = request.site_user
  data = request.json
  notification_ids = data.get("notification_ids")
  if not notification_ids:
    return BadRequest()
  Notification.objects.filter(user=user, id__in=notification_ids).update(read=True)
  delete_cache("NOTIFICATIONS", id_val=user.id)
  return Ok()
