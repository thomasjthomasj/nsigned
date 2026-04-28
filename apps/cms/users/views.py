import json
import jwt
from datetime import datetime, timezone
from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseNotAllowed, JsonResponse
from django.shortcuts import render
from .auth import issue_tokens, decode
from .models import User

def login(request):
  if request.method != "POST":
    return HttpResponseNotAllowed(["POST"])

  data = json.loads(request.body)

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

  return JsonResponse({
    "access": tokens["access"],
    "refresh": tokens["refresh"],
  })

def refresh_token(request):
  if request.method != "POST":
    return HttpResponseNotAllowed(["POST"])

  data = json.loads(request.body)
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
