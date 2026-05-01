import json
import re
import requests
from bs4 import BeautifulSoup
from app.utils import strip_url_query

class BandcampError(ValueError):
  pass

def get_release_details(url):
  base_url = strip_url_query(url)
  pattern = r"^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/(album|track)\/"
  match = re.match(pattern, base_url)
  if not match:
    raise BandcampError("Not a valid Bandcamp release URL")
  release_type = match.group(1)
  html = requests.get(base_url).text
  parsed = BeautifulSoup(html, "html.parser")

  try:
    script = parsed.find("script", type="application/ld+json")
    if not script:
      raise ValueError("No script found")
    data = json.loads(script.string)
    if isinstance(data, list):
      data = data[0]
    artist_name = data["byArtist"]["name"]
    release_data = data["albumRelease"][0]
    title = release_data["name"]
    label = release_data.get("recordLabel", {}).get("name")
    image = data.get("image")
    image_url = image[0] if isinstance(image, list) else image
  except:
    title_meta = parsed.find("meta", property="og:title")
    artist_meta = parsed.find("meta", property="og:site_name")
    image_meta = parsed.find("meta", property="og:image")
    label = None
    if not title_meta:
      raise BandcampError("Could not read title from Bandcamp page")
    if not artist_meta:
      raise BandcampError("Could not read artist name from Bandcamp page")

    bc_title = title_meta["content"]
    artist_name = artist_meta["content"]
    title = bc_title.replace(f", by {artist_name}", "").strip()
    image_url = image_meta["content"] if image_meta else None

    if not title:
      raise BandcampError("Title is empty")
    if not artist_name:
      raise BandcampError("Artist name is empty")

  return {
    "artist_name": artist_name,
    "title": title,
    "label": label,
    "image_url": image_url,
    "release_type": release_type,
    "link": base_url,
  }
