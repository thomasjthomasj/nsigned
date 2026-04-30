from urllib.parse import urlsplit, urlunsplit
from app.settings import DEBUG

def strip_url_query(url):
  parts = urlsplit(url)
  return urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))

def set_auth_cookie(response, name, value):
  response.set_cookie(
    name,
    value,
    httponly=True,
    secure=not DEBUG,
    samesite="Lax" if DEBUG else "None",
  )
