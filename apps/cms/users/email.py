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

def send_email(
  email,
  subject,
  body,
  fromAddress="noreply@nsigned.com",
  fromName="_nsigned"
):
  url = "https://api.goodsender.com/v1/emails/send"
  return requests.post(
    url=url,
    json={
      "emails": [{
        "from": { "email": fromAddress, "name": fromName },
        "to": [{ "email": email }],
        "subject": subject,
        "text_content": body,
      }],
    },
    headers=get_headers(),
  )

def send_otp(user, otp):
  message = f"""
Hello {user.display_name}

Here is your single use password for _nsigned.

{otp}

Copy and paste it onto the login form (https://nsigned.com/login) to sign in.
"""
  return send_email(
    email=user.email,
    subject="Welcome to _nsigned",
    body=message,
  )

def request_consent(user):
  url = "https://api.goodsender.com/v1/emails/consent"
  return requests.post(
    url=url,
    json={
      "domain": "nsigned.com",
      "emails": [
        { "email": user.email },
      ]
    },
    headers=get_headers(),
  )
