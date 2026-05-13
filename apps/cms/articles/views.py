from datetime import datetime, timedelta
from django.db.models import Q
from django.db import transaction
from slugify import slugify
from app.decorators import logged_in, method
from app.http import Ok, BadRequest, NotFound
from music.models import Release, ReviewRequest
from .models import Article, Comment, CommentContent

@method("GET")
def list(request):
  page = int(request.GET.get("page", 1))
  page_size = int(request.GET.get("page_size", 20))
  author = request.GET.get("author")
  artist_user = request.GET.get("artist_user")
  artist_slug = request.GET.get("artist")
  article_type = request.GET.get("type")
  exclude_id = request.GET.get("exclude")

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

  if author:
    articles = articles.filter(created_by__username=author)

  if artist_user:
    articles = articles.filter(
      Q(review_request__created_by__username=artist_user) |
      Q(review_request__release__primary_artist__user__username=artist_user)
    )

  if artist_slug:
    articles = articles.filter(
      review_request__release__primary_artist__slug=artist_slug
    )

  if exclude_id:
    articles = articles.exclude(id=int(exclude_id))

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
@logged_in()
def create(request):
  data = request.json
  created_by = request.site_user

  content = data.get("content", "").strip()
  title = data.get("title", "").strip()
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

@method("POST")
@logged_in()
@transaction.atomic()
def comment(request, article_id):
  user = request.site_user
  data = request.json
  content = data["content"].strip()
  idempotency_key = data["idempotency_key"]
  if not content:
    return BadRequest("Comment has no content")
  if not idempotency_key:
    return BadRequest()

  article = Article.objects.get(id=article_id)
  dupe_time_limit = datetime.now() - timedelta(minutes=5)
  spam_time_limit = datetime.now() - timedelta(seconds=15)

  dupe = Comment.objects.filter(
    created_by=user,
    created_at__gte=dupe_time_limit,
    contents__content=content,
  ).exists()
  spam = Comment.objects.filter(
    created_by=user,
    created_at__gte=spam_time_limit,
  ).exists()

  if dupe:
    return BadRequest("You have recently commented this comment.")
  if spam:
    return BadRequest("Please wait a moment before commenting again.")

  comment = Comment.objects.create(
    article=article,
    created_by=user,
    idempotency_key=idempotency_key,
  )
  CommentContent.objects.create(
    comment=comment,
    content=content,
  )

  reloaded = Comment.objects.prefetched.get(id=comment.id)

  return Ok(reloaded.serialized)

@method("GET")
def get_comments(request, article_id):
  comments = Comment.objects.prefetched.filter(
    article__id=article_id
  ).order_by("created_at")

  return Ok([comment.serialized for comment in comments])
