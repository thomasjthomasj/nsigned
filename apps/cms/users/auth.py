import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings

def encode(payload):
  return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def decode(token):
  return jwt.decode(token, settings.SECRET_KEY, algorithm="HS256")

def issue_tokens(user):
  now = datetime.now(timezone.utc)
  access = {
    "user_id": user.id,
    "type": "access",
    "exp": now + timedelta(hours=1),
    "iat": now,
  }

  refresh = {
    "user_id": user.id,
    "type": "refresh",
    "exp": now + timedelta(days=14),
    "iat": now,
  }

  return {
    "access": encode(access),
    "refresh": encode(refresh),
  }
