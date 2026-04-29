import jwt
from django.db import transaction
from datetime import datetime, timezone
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from app.decorators import method
from .auth import issue_tokens, decode
from .models import User

@method("POST")
def register(request):
  required = ["email", "username", "password", "password_confirm"]
  data = request.json

  for field in required:
    if not data.get(field):
      return JsonResponse({"error": f"Missing `%s` field" % field}, status=400)

  email = data.get("email")
  username = data.get("username")
  display_name = data.get("display_name")
  password = data.get("password")
  password_confirm = data.get("password_confirm")

  if not password == password_confirm:
    return JsonResponse({"error": "`password` does not match `password_confirm`"}, status=400)

  try:
    User.objects.get(email=email)
    return JsonResponse({"error": "User already exists"}, status=400)
  except User.DoesNotExist:
    pass

  with transaction.atomic():
    user = User.objects.create_user(
      username=username,
      email=email,
      password=password,
      display_name=display_name,
      last_login=datetime.now(timezone.utc)
    )
    tokens = issue_tokens(user)
    return JsonResponse(tokens)

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
    return JsonResponse({"error": "invalid credentials"}, status=401)

  tokens = issue_tokens(user)

  return JsonResponse(tokens)

@method("POST")
def refresh_token(request):
  data = request.json
  refresh_token = data.get("refresh_token")
  if not refresh_token:
    return JsonResponse({"error": "no refresh token"}, status=401)

  try:
    payload = decode(refresh_token)
  except jwt.InvalidTokenError:
    return JsonResponse({"error": "invalid refresh token"}, status=401)

  if payload.get("type") != "refresh":
    return JsonResponse({"error": "invalid token type"}, status=401)


  try:
    user =User.objects.get(id=payload["user_id"])
  except User.DoesNotExist:
    return JsonResponse({"error": "user not found"}, status=404)

  tokens = issue_tokens(user)

  return JsonResponse(tokens)
