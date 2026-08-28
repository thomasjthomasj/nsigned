import requests
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from django.conf import settings

class PatreonUnauthorizedError(BaseException):
  pass

class PatreonAPIError(BaseException):
  pass

class PatreonDataError(ValueError):
  pass

def get_access_token(code):
  endpoint = "https://www.patreon.com/api/oauth2/token"
  response = requests.post(
    endpoint,
    data={
      "code": code,
      "grant_type": "authorization_code",
      "client_id": settings.PATREON["CLIENT_ID"],
      "client_secret": settings.PATREON["CLIENT_SECRET"],
      "redirect_uri": f"{settings.SITE_URL}/patreon",
    }
  )
  if not response.ok:
    raise PatreonAPIError("Could not authorize user")
  data = response.json()
  expires_at = datetime.now(timezone.utc) + timedelta(seconds=data["expires_in"])
  return {
    "access_token": data["access_token"],
    "refresh_token": data["refresh_token"],
    "expires_at": expires_at,
  }

def refresh_access_token(refresh_token):
  endpoint = "https://www.patreon.com/api/oauth2/token"
  response = requests.post(
    endpoint,
    data={
      "grant_type": "refresh_token",
      "refresh_token": refresh_token,
      "client_id": settings.PATREON["CLIENT_ID"],
      "client_secret": settings.PATREON["CLIENT_SECRET"],
    },
  )
  if not response.ok:
    raise PatreonAPIError("Could not get refresh token")
  data = response.json()
  expires_at = datetime.now(timezone.utc) + timedelta(seconds=data["expires_in"])
  return {
    "access_token": data["access_token"],
    "refresh_token": data["refresh_token"],
    "expires_at": expires_at,
  }

def get_identity(patreon_user):
  endpoint = "https://www.patreon.com/api/oauth2/v2/identity"
  query_string = urlencode({
    "include": "memberships",
    "fields[member]": "patron_status",
    "fields[tier]": "title",
  })
  url = f"{endpoint}?{query_string}"
  response = requests.get(url, headers={
    "Authorization": f"Bearer {patreon_user.access_token}",
  })
  if not response.ok:
    if (response.status_code == 401):
      raise PatreonUnauthorizedError
    raise PatreonAPIError(f"Got error response from Patreon: {response.status_code}")
  data = response.json()
  try:
    patron_id = data["id"]
    tiers = [d["attributes"]["title"] for d in data["included"] if d["type"] == "tier"]
    tier = None

    if "Supporter" in tiers:
      tier = "supporter"
    if not tier:
      return None

    return {
      "id": patron_id,
      "tier": tier,
    }
  except ValueError, KeyError:
    raise PatreonDataError("Patreon data format was not as expected")
