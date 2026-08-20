from django.test import TestCase
from articles.utils import parse_search_terms

class SearchTermsTestCase(TestCase):
  def test_parse_search_terms_simple(self):
    parsed = parse_search_terms("bing bang bong")
    expected = {
      "terms": ["bing", "bang", "bong"],
      "artist": None,
      "author": None,
      "from": None,
      "to": None,
    }
    self.assertDictEqual(parsed, expected)

  def test_parse_search_terms_with_quotes(self):
    parsed = parse_search_terms("\"bing bang\" bong")
    expected = {
      "terms": ["bing bang", "bong"],
      "artist": None,
      "author": None,
      "from": None,
      "to": None,
    }
    self.assertDictEqual(parsed, expected)

  def test_parse_search_terms_artist(self):
    parsed = parse_search_terms("artist:bing bang bong")
    expected = {
      "terms": ["bang", "bong"],
      "artist": "bing",
      "author": None,
      "from": None,
      "to": None,
    }
    self.assertDictEqual(parsed, expected)

  def test_parse_search_terms_author(self):
    parsed = parse_search_terms("author:bing bang bong")
    expected = {
      "terms": ["bang", "bong"],
      "artist": None,
      "author": "bing",
      "from": None,
      "to": None,
    }
    self.assertDictEqual(parsed, expected)

  def test_parse_search_terms_from_to(self):
    parsed = parse_search_terms("bing bang bong from:2025-01-01 to:2026-01-01")
    expected = {
      "terms": ["bing", "bang", "bong"],
      "artist": None,
      "author": None,
      "from": "2025-01-01",
      "to": "2026-01-01",
    }
    self.assertDictEqual(parsed, expected)
