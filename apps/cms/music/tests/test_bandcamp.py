import pathlib
from unittest.mock import patch
from django.test import TestCase
from music.bandcamp import get_release_details

complete_url = "https://godribbon.bandcamp.com/album/complete"
no_ldjson_url = "https://godribbon.bandcamp.com/album/no-ldjson"

class MockResponse:
  def __init__(self, html, status_code):
    self.html = html
    self.status_code = status_code

  @property
  def text(self):
    return self.html

def mocked_requests_get(*args, **kwargs):
  url = args[0]
  path = pathlib.Path(__file__).parent.resolve()
  if url == complete_url:
    with open(f"{path}/data/bandcamp_complete.html") as f:
      return MockResponse(f.read(), 200)
  if url == no_ldjson_url:
    with open(f"{path}/data/bandcamp_no_ldjson.html") as f:
      return MockResponse(f.read(), 200)
  return MockResponse(None, 404)

class BandcampTestCase(TestCase):
  @patch("requests.get", side_effect=mocked_requests_get)
  def test_get_release_details(self, mock_get):
    release_details = get_release_details(complete_url)
    expected = {
      "artist_name": "GOD RIBBON",
      "title": "Oinker",
      "label": None,
      "images": {
        "sm": {
          "url": "https://f4.bcbits.com/img/a1454893987_8.jpg",
          "height": 124,
          "width": 124,
        },
        "md": {
          "url": "https://f4.bcbits.com/img/a1454893987_2.jpg",
          "height": 350,
          "width": 350,
        },
        "lg": {
          "url": "https://f4.bcbits.com/img/a1454893987_10.jpg",
          "height": 1200,
          "width": 1200,
        },
      },
      "release_type": "album",
      "link": complete_url,
    }

    self.assertDictEqual(release_details, expected)
    self.assertEqual(len(mock_get.call_args_list), 1)

  @patch("requests.get", side_effect=mocked_requests_get)
  def test_get_release_details_no_ldjson(self, mock_get):
    release_details = get_release_details(no_ldjson_url)
    expected = {
      "artist_name": "GOD RIBBON",
      "title": "Oinker",
      "label": None,
      "images": {
        "sm": {
          "url": "https://f4.bcbits.com/img/a1454893987_8.jpg",
          "height": 124,
          "width": 124,
        },
        "md": {
          "url": "https://f4.bcbits.com/img/a1454893987_2.jpg",
          "height": 350,
          "width": 350,
        },
        "lg": {
          "url": "https://f4.bcbits.com/img/a1454893987_10.jpg",
          "height": 1200,
          "width": 1200,
        },
      },
      "release_type": "album",
      "link": no_ldjson_url,
    }

    self.assertDictEqual(release_details, expected)
    self.assertEqual(len(mock_get.call_args_list), 1)
