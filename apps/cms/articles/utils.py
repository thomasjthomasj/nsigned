import re
from markdown_it import MarkdownIt

def get_content(contents):
  return next(content for content in contents.all() if content.active)

def parse_markdown(text):
  if not text: return ""
  parser = MarkdownIt("commonmark", {"html": False}).disable([
    "heading",
    "code",
    "fence",
    "table",
    "image",
    "link",
    "hr",
  ])
  return parser.render(text)

def parse_search_terms(text):
  space_replacement = "::__::"
  def space_replacer(match):
    return match.group(1).replace(" ", space_replacement).replace("\"", "")
  terms = []
  special_terms = {
    "artist": None,
    "author": None,
    "from": None,
    "to": None,
  }
  for term in re.sub(r'"([^"]*)"', space_replacer, text).split(" "):
    term = term.replace(space_replacement, " ")
    parts = term.split(":")
    if len(parts) == 2 and parts[0] in special_terms:
      special_terms[parts[0]] = parts[1]
    else:
      terms.append(term)
  return {
    **{"terms": terms},
    **special_terms,
  }
