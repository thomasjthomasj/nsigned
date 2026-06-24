import requests
from django.conf import settings

from_email = { "email": "noreply@nsigned.com", "name": "_nsigned" }

def get_headers():
  secret = settings.RESEND_SECRET
  if not secret:
    raise Exception("No Resend secret set")
  return {
    "Authorization": f"Bearer {secret}",
    "Content-Type": "application/json",
  }

def send_email(email_address, subject, text, html):
  url = "https://api.resend.com/emails"
  return requests.post(
    url=url,
    headers=get_headers(),
    json={
      "from": "_nsigned <noreply@nsigned.com>",
      "to": [email_address],
      "subject": subject,
      "text": text,
      "html": html,
    }
  )

def send_otp(user, otp):
  text = f"""Welcome to _nsigned!

Here is your single use password:

{otp}
"""
  html = f"""<p><strong>Welcome to _nsigned!</strong></p>
  <p>Here is your single use password:</p>
  <p><strong>{otp}</strong></p>
  """

  return send_email(
    email_address=user.email,
    subject="Welcome to _nsigned",
    text=text,
    html=html
  )

def get_article_notification_content(user, article, release):
  article_url = f"https://nsigned.com/article/{article.id}/{article.slug}"
  text = f"""
Hello {user.display_name}!

{article.created_by.display_name} has published a review of {release.title}!

Take a look via the link below, and feel free to leave a comment for the reviewer!

{article_url}
"""
  html = f"""
<p>Hello {user.display_name}!</p>

<p>{article.created_by.display_name} has published a review of {release.title}!</p>

<p>Take a look <a href="{article_url}">here</a>, and feel free to leave a comment for the reviewer!</p>
"""
  return { "text": text, "html": html }

def send_article_notification(review_request):
  user = review_request.created_by
  article = review_request.article
  release = review_request.release
  if not article:
    return False
  subject = f"A review of {release.title} has been published!"
  content = get_article_notification_content(user, article, release)

  return send_email(
    email_address=user.email,
    subject=subject,
    text=content["text"],
    html=content["html"],
  )

class EmailError(Exception):
  pass
