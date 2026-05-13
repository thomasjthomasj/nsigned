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
