import requests
from urllib.parse import urlencode
from django.conf import settings

class PatreonUnauthorizedError(BaseException):
  pass

class PatreonAPIError(BaseException):
  pass

class PatreonDataError(ValueError):
  pass

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
  return {
    "access_token": data["access_token"],
    "refresh_token": data["refresh_token"],
  }

def get_identity(patron_user):
  endpoint = "https://www.patreon.com/api/oauth2/v2/identity"
  query_string = urlencode({
    "include": "memberships",
    "fields[member]": "patron_status",
    "fields[tier]": "title",
  })
  url = f"{endpoint}?{query_string}"
  response = requests.get(url, headers={
    "Authorization": f"Bearer {patron_user.access_token}",
  })
  if not response.ok:
    if (response.status_code == 401):
      raise PatreonUnauthorizedError
    raise PatreonAPIError(f"Got error response from Patreon: {response.status_code}")
  data = response.json()
  try:
    patron_id = data["id"]
    tiers = [d["attributes"]["title"] for d in data["included"] if d["type"] == "tier"]
    if "Supporter" in tiers:
      tier = "supporter"
    return {
      "id": patron_id,
      "tier": tier,
    }
  except ValueError, KeyError:
    raise PatreonDataError("Patreon data format was not as expected")
