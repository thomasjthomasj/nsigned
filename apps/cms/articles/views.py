from slugify import slugify
from app.decorators import logged_in, method
from app.http import Ok, BadRequest, NotFound
from music.models import Release, ReviewRequest
from .models import Article

@method("GET")
def list(request):
  page_size = 20
  page = request.GET.get("page", 1)
  start = (page - 1) * page_size
  end = page * page_size
  articles = Article.cms.prefetched.order_by("-published_at").all()[start:end]
  return Ok([article.serialized_lite for article in articles])

@method("GET")
def article(request, article_id):
  article = Article.cms.prefetched.get(pk=article_id)
  if not article:
    return NotFound()

  return Ok(article.serialized)

@method("POST")
@logged_in(role="contributor")
def create(request):
  data = request.json
  created_by = request.site_user

  content = data.get("content")
  title = data.get("title")
  review_request_id = data.get("review_request")
  if not content or not title:
    return BadRequest("`content` and `title` are required")

  review_request = None

  try:
    if review_request_id:
      review_request = ReviewRequest.objects.get(id=review_request_id)
  except ReviewRequest.DoesNotExist:
    return NotFound()

  slug = slugify(title)
  article = Article.cms.create(
    title=title,
    slug=slug,
    created_by=created_by,
    content=content,
    review_request=review_request,
  )

  return Ok(article.serialized)
