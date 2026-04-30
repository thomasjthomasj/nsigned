from slugify import slugify
from app.decorators import logged_in, method
from app.http import Ok, BadRequest, NotFound
from music.models import Release
from .models import Article
from .utils import article_json

def index(request):
  return Ok("This is the articles index.")

def article(request, article_id):
  article = Article.objects \
    .prefetch_related("contents") \
    .select_related("created_by") \
    .select_related("external_link") \
    .get(pk=article.id)
  if not article:
    return NotFound()

  return Ok(article_json(article))

@method("POST")
@logged_in(role="contributor")
def create(request):
  data = request.json
  created_by = request.site_user

  content = data.get("content")
  title = data.get("title")
  external_link = data.get("external_link")
  release = None
  if not content or not title:
    return BadRequest("`content` and `title` are required")

  if external_link:
    try:
      release = Release.bandcamp.get_from_url(external_link)
    except ValueError:
      return BadRequest("Could not resolve release from given URL")

  slug = slugify(title)
  article = Article.cms.create(
    title=title,
    slug=slug,
    created_by=created_by,
    content=content,
    release=release,
    external_link=external_link,
  )

  return Ok(article_json(article))
