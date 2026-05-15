from markdown_it import MarkdownIt
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
    domain=None if DEBUG else ".nsigned.com"
  )

def parse_markdown(text, allow_links=False):
  blacklist = [
    "heading",
    "code",
    "fence",
    "table",
    "image",
    "hr",
  ]
  if not allow_links:
    blacklist.append("link")
  parser = MarkdownIt("commonmark", {"html": False}).disable(blacklist)
  return parser.render(text)

def has_permission(user, role):
  role_map = {
    "contributor": ("contributor", "editor", "admin"),
    "editor": ("editor", "admin"),
    "admin": ("admin"),
  }
  allowed_roles = role_map[role]
  if not allowed_roles:
    raise Exception("Invalid role")
  return user.role in allowed_roles
