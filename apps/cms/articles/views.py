from random import sample
from datetime import datetime, timedelta
from django.db.models import Q
from django.db import transaction
from slugify import slugify
from app.decorators import logged_in, method, cached
from app.http import Ok, BadRequest, NotFound, Forbidden
from app.utils import delete_cache, delete_cache_prefix, has_permission
from music.bandcamp import get_release_details
from music.models import ReviewRequest, Release
from users.models import Notification
from users.email import send_consent_emails, send_article_notifications
from .models import Article, Comment, CommentContent

@method("GET")
@cached("ARTICLES", get_params=[
  "page",
  "page_size",
  "author",
  "artist_user",
  "artist",
  "type",
  "exclude",
  "genre"
])
def list(request):
  page = int(request.GET.get("page", 1))
  page_size = int(request.GET.get("page_size", 20))
  author = request.GET.get("author")
  artist_user = request.GET.get("artist_user")
  artist_slug = request.GET.get("artist")
  article_type = request.GET.get("type")
  exclude_id = request.GET.get("exclude")
  genre = request.GET.get("genre")

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

  if genre:
    articles = articles.filter(review_request__release__genre=genre)

  return Ok([
    article.serialized_lite
    for article in articles.all()[start:end]]
  )

@method("GET")
@cached("ARTICLES:RANDOM", get_params=["exclude"], timeout=600)
def random(request):
  max_articles = 12
  exclude = [int(i) for i in request.GET.get("exclude", []).split(",")]
  article_query = Article.cms.prefetched.exclude(id__in=exclude).exclude(review_request=None).order_by("id")
  article_count = article_query.count()

  keys = sample(range(article_query.count()), max_articles if article_count > max_articles else article_count)
  articles = []
  for key in keys:
    article = article_query[key]
    articles.append(article)

  return Ok([article.serialized_lite for article in articles])

@method("GET")
@cached("ARTICLE", id_kwarg="article_id")
def article(request, article_id):
  article = Article.cms.prefetched_w_deleted.get(pk=article_id)
  if not article:
    return NotFound()

  return Ok(article.serialized)

@method("POST")
@logged_in()
@transaction.atomic()
def create(request):
  data = request.json
  created_by = request.site_user

  content = data.get("content", "").strip()
  title = data.get("title", "").strip()
  review_request_id = data.get("review_request")
  genre = data.get("genre")
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
  delete_cache_prefix("ARTICLES")
  delete_cache_prefix("AUTHORS")
  delete_cache_prefix("ARTISTS")

  if review_request:
    release = review_request.release
    rr_user = review_request.created_by

    if genre and release.genre != genre:
      release.genre = genre
      release.save()

    delete_cache("REVIEW-REQUEST", id_val=review_request.id)
    Notification.objects.create_notification(
      user=rr_user,
      text=f"{created_by.display_name} reviewed {review_request.release.title}",
      link=f"/article/{article.id}/{article.slug}",
    )

    if review_request.notify_on_review:
      if rr_user.can_email == None:
        r = send_consent_emails([rr_user])
      elif rr_user.can_email == True:
        # reload review request
        review_request = ReviewRequest.objects.get(id=review_request.id)
        r = send_article_notifications([review_request])

  return Ok(article.serialized)

@method("POST")
@logged_in()
@transaction.atomic()
def update(request, article_id):
  data = request.json
  user = request.site_user

  try:
    article = Article.objects.get(id=article_id)
  except Article.NotFound:
    return NotFound()

  content = data.get("content")
  genre = data.get("genre")
  if not content:
    return BadRequest()

  has_right = has_permission(user, "editor") or article.created_by.id == user.id
  if not has_right:
    return Forbidden()
  article.update_content(content, user)

  if genre and hasattr(article, "review_request") and article.review_request.release.genre != genre:
    release = article.review_request.release
    release.genre = genre
    release.save()
    delete_cache_prefix("ARTICLES")

  delete_cache("ARTICLE", id_val=article_id)
  return Ok(article.serialized)

@method("POST")
@logged_in("admin")
def delete(request, article_id):
  data = request.json
  try:
    article = Article.objects.get(id=article_id)
  except Article.NotFound:
    return NotFound()
  reason = data.get("reason")
  if not reason:
    return BadRequest("No reason given")
  article.deleted = True
  article.deleted_reason = reason
  if article.review_request:
    review_request = article.review_request
    review_request.claimed_by = None
    review_request.save()
    delete_cache("REVIEW-REQUESTS")
    delete_cache("REVIEW-REQUEST", id_val=review_request.id)
    article.review_request = None
  delete_cache("ARTICLE", id_val=article_id)
  delete_cache_prefix("ARTICLES")
  article.save()
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

  def notify(send_to):
    Notification.objects.create_notification(
      user=send_to,
      text=f"{user.display_name} commented on \"{article.title}\"",
      link=f"/article/{article.id}/{article.slug}#comment-{comment.id}",
    )

  if user.id is not article.created_by.id:
    notify(article.created_by)

  if article.review_request and user.id is not article.review_request.created_by.id:
    notify(article.review_request.created_by)

  reloaded = Comment.objects.prefetched.get(id=comment.id)
  delete_cache("ARTICLE-COMMENTS", id_val=article_id)

  return Ok(reloaded.serialized)

@method("GET")
@cached("ARTICLE-COMMENTS", id_kwarg="article_id")
def get_comments(request, article_id):
  comments = Comment.objects.prefetched.filter(
    article__id=article_id
  ).order_by("created_at")

  return Ok([comment.serialized for comment in comments])

@method("GET")
@cached("ARTICLES:SITEMAP", timeout=86400)
def sitemap(request):
  articles = Article.objects.filter(deleted=False).order_by("-published_at")[:500]
  return Ok([{
    "id": a.id,
    "slug": a.slug,
    "published_at": a.published_at.isoformat(),
  } for a in articles])

@method("POST")
@logged_in("editor")
def revalidate_images(request, article_id):
  article = Article.objects.get(id=article_id)
  if not article:
    return NotFound()
  if not article.review_request:
    return BadRequest("Article does not have an associated review request")
  release = article.review_request.release
  link = release.links.all()[0]
  release_details = get_release_details(link.url)
  if not release_details["images"]:
    return BadRequest("Release does not have images")
  release.images = release_details["images"]
  release.save()
  delete_cache("ARTICLE", id_val=article_id)
  delete_cache_prefix("ARTICLES")
  return Ok()
