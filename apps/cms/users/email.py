import requests
from django.conf import settings

def get_headers():
  secret = settings.GOODSENDER["SECRET"]
  if not secret:
    raise Exception("No Goodsender secret set")
  return {
    "Authorization": f"Bearer {secret}",
    "Content-Type": "application/json",
  }

def send_otp(user, otp):
  url = "https://api.goodsender.com/v1/emails/template"
  return requests.post(
    url=url,
    headers=get_headers(),
    json={
      "from": { "email": "noreply@nsigned.com", "name": "_nsigned" },
      "to": { "email": user.email, "name": user.display_name },
      "subject": "Welcome to _nsigned",
      "template": {
        "template_id": "otp_code",
        "variables": {
          "app_name": "_nsigned",
          "otp_code": otp,
          "expiry_minutes": "10",
        }
      }
    }
  )
