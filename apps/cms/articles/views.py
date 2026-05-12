from django.db.models import Q
from slugify import slugify
from app.decorators import logged_in, method
from app.http import Ok, BadRequest, NotFound
from music.models import Release, ReviewRequest
from .models import Article

@method("GET")
def list(request):
  page = int(request.GET.get("page", 1))
  page_size = int(request.GET.get("page_size", 20))
  author_id = request.GET.get("author")
  artist_user_id = request.GET.get("artist_user")
  artist_slug = request.GET.get("artist")
  article_type = request.GET.get("type", None)

  if page_size > 100:
    return BadRequest("Cannot request more than 100 articles.")

  start = (page - 1) * page_size
  end = page * page_size
  articles = Article.cms.prefetched.order_by("-published_at")

  if article_type:
    if article_type not in ["blog", "album", "track", "review"]:
      return BadRequest(f"`{article_type}` is not a valid article type.")
    if article_type == "blog":
      articles = articles.filter(review_request=None)
    elif article_type in ["album", "track"]:
      articles = articles.filter(review_request__release__release_type=article_type)
    else:
      articles = articles.exclude(review_request=None)

  if author_id:
    articles = articles.filter(created_by__id=int(author_id))

  if artist_user_id:
    artist_user_id = int(artist_user_id)
    articles = articles.filter(
      Q(review_request__created_by__id=artist_user_id) |
      Q(release__artist__user__id=artist_user_id)
    )

  if artist_slug:
    articles = articles.filter(
      review_request__release__primary_artist__slug=artist_slug
    )

  return Ok([
    article.serialized_lite
    for article in articles.all()[start:end]]
  )

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
