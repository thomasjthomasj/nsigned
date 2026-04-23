from urllib.parse import urlsplit, urlunsplit

def strip_url_query(url):
  parts = urlsplit(url)
  return urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))
