import requests
from django.conf import settings

from_email = { "email": "noreply@nsigned.com", "name": "_nsigned" }

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
      "from": from_email,
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

def send_consent_emails(users):
  url = "https://api.goodsender.com/v1/emails/consent"
  emails = [{ "email": user.email, "name": user.display_name } for user in users]
  return requests.post(
    url=url,
    headers=get_headers(),
    json={
      "domain": "nsigned.com",
      "emails": emails,
    }
  )

def get_article_notification_content(user, article, release):
  article_url = f"https://nsigned.com/article/{article.id}/{article.slug}"
  text = f"""
Hello {user.display_name}!

{article.created_by.display_name} has published a review of {release.title}!

Check it out via the link below

{article_url}
"""
  html = f"""
<p>Hello {user.display_name}!</p>

<p>{article.created_by.display_name} has published a review of {release.title}!</p>

<p>Check it out <a href="{article_url}">here</a>!</p>
"""
  return { "text": text, "html": html }

def send_article_notifications(review_requests):
  url = "https://api.goodsender.com/v1/emails/send"
  emails = []
  for review_request in review_requests:
    user = review_request.created_by
    article = review_request.article
    release = review_request.release
    if not article:
      continue
    subject = f"A review of {release.title} has been published!"
    content = get_article_notification_content(user, article, release)
    emails.append({
      "from": from_email,
      "to": [{ "email": user.email, "name": user.display_name }],
      "subject": subject,
      "text_content": content["text"],
      "html_content": content["html"],
    })

  return requests.post(
    url=url,
    headers=get_headers(),
    json={
      "emails": emails,
    }
  )
