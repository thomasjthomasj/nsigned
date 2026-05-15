import jwt
from django.db import transaction
from django.core.validators import validate_email
from datetime import datetime, timezone
from django.core.exceptions import PermissionDenied, ValidationError
from app.decorators import method, logged_in, logged_out
from app.http import Ok, NotFound, BadRequest, Unauthorized
from app.settings import DEBUG
from app.utils import set_auth_cookie, parse_markdown, delete_auth_cookies
from links.models import Link
from .auth import issue_tokens, decode
from .models import User
from .validators import fundraiser_link_validator

@logged_in()
def get_me(request):
  user = request.site_user
  return Ok(user.serialized | { "email": user.email, "bio": user.bio })

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
  return Ok(user.serialized)

@method("POST")
@logged_out()
def register(request):
  required = ["email", "username", "password", "password_confirm"]
  data = request.json

  for field in required:
    if not data.get(field):
      return BadRequest(f"Missing `%s` field" % field)

  email = data.get("email")
  username = data.get("username")
  display_name = data.get("display_name", username)
  password = data.get("password")
  password_confirm = data.get("password_confirm")

  if not password == password_confirm:
    return BadRequest("`password` does not match `password_confirm`")

  email_exists = User.objects.filter(email=email).exists()
  if email_exists:
    return BadRequest("User with this email already exists")

  username_exists = User.objects.filter(username=username).exists()
  if username_exists:
    return BadRequest("This username is taken")

  with transaction.atomic():
    user = User.objects.create_user(
      username=username,
      email=email,
      password=password,
      display_name=display_name,
      last_login=datetime.now(timezone.utc)
    )
    tokens = issue_tokens(user)
    response = Ok()
    set_auth_cookie(response, "access-token", tokens["access"])
    set_auth_cookie(response, "refresh-token", tokens["refresh"])

    return response

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
  user.last_login = datetime.now(timezone.utc)
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
