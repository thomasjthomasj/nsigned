import jwt
from django.db import transaction
from datetime import datetime, timezone
from django.core.exceptions import PermissionDenied
from app.decorators import method, logged_in
from app.http import Ok, NotFound, BadRequest, Unauthorized
from .auth import issue_tokens, decode
from .models import User

@logged_in()
def get_me(request):
  user = request.user
  return Ok({
    "id": user.id,
    "username": user.username,
    "display_name": user.display_name,
    "email": user.email,
    "role": user.role,
  })

def get_user(request, username):
  try:
    user = User.objects.get(username=username)
    return Ok({
      "id": user.id,
      "username": user.username,
      "display_name": user.display_name,
      "role": user.role,
    })
  except User.DoesNotExist:
    return NotFound()

@method("POST")
def register(request):
  required = ["email", "username", "password", "password_confirm"]
  data = request.json

  for field in required:
    if not data.get(field):
      return BadRequest(f"Missing `%s` field" % field)

  email = data.get("email")
  username = data.get("username")
  display_name = data.get("display_name")
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
    return Ok(tokens)

@method("POST")
def login(request):
  data = request.json

  username = data.get("username")
  email = data.get("email")
  password = data.get("password")

  try:
    user = User.objects.authenticate(email=email, username=username, password=password)
    user.last_login = datetime.now(timezone.utc)
    user.save()
  except PermissionDenied:
    return Unauthorized("Invalid credentials")

  tokens = issue_tokens(user)

  return Ok(tokens)

@method("POST")
def refresh_token(request):
  data = request.json
  refresh_token = data.get("refresh_token")
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

  return Ok(tokens)
