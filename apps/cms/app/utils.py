from django.core.cache import cache
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

def delete_auth_cookies(response):
  response.delete_cookie("access-token", domain=None if DEBUG else ".nsigned.com")
  response.delete_cookie("refresh-token", domain=None if DEBUG else ".nsigned.com")

def parse_markdown(text, allow_links=False):
  if not text:
    return ""
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

def get_cache_key(key, id_val=None, get_params=[], get_data={}):
  cache_key = f"NSOGNED:{key}{f":{id_val}" if id_val else ""}"

  get_params.sort()
  for param in get_params:
    val = get_data
    if val:
      cache_key = f"{cache_key}:{param}={val}"

  return cache_key

def delete_cache(key, id=None, get_params=[]):
  cache.delete(get_cache_key(key))

def delete_cache_prefix(prefix):
  cache.delete_pattern(f"{get_cache_key(prefix)}:*")
