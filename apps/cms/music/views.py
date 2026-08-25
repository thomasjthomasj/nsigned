from django.db.models import Q, Count
from django.db import transaction
from django.db.models.functions import Lower
from app.http import Ok, BadRequest, NotFound, Forbidden
from app.decorators import logged_in, method, cached
from app.utils import delete_cache, delete_cache_prefix
from articles.models import Article
from .bandcamp import get_release_details, BandcampError
from .models import Artist, Release, ReviewRequest

@cached("RELEASE-DETAILS", get_params=["url"])
def release_details(request):
  url = request.GET.get("url")
  if not url:
    return BadRequest("URL is required")
  try:
    details = get_release_details(url)
  except BandcampError:
    return BadRequest("Could not retrieve details")
  return Ok(details)

@method("POST")
@logged_in()
@transaction.atomic()
def request_review(request):
  data = request.json
  user = request.site_user
  url = data.get("url")
  notify_on_review = data.get("notify", True)
  genre = data.get("genre")
  if not url:
    return BadRequest("URL is required")
  try:
    release = Release.bandcamp.get_from_url(url, genre)
  except ValueError:
    return BadRequest("Could not get release from URL")

  if user.role != "admin":
    exists = ReviewRequest.objects.filter(
      article__isnull=True,
      rejected_by=None,
    ).filter(
      Q(release=release) |
      Q(created_by=user) |
      Q(release__primary_artist__user=user)
    ).exists()

    if exists:
      return Forbidden("You have already have an active review request")

  artist = release.primary_artist
  if artist and not artist.user:
    artist.user = user
    artist.save()
  elif artist and not artist.user.id == user.id:
    return BadRequest("This release belongs to another user")

  if ReviewRequest.objects.filter(release=release).exists():
    return BadRequest("This release has already been requested for review")

  review_request = ReviewRequest.objects.create(
    release=release,
    notify_on_review=notify_on_review,
    created_by=user,
  )

  delete_cache("REVIEW-REQUESTS")

  return Ok(review_request.serialized)

@method("GET")
@cached("REVIEW-REQUEST", id_kwarg="id")
def get_review_request(request, id):
  try:
    review_request = ReviewRequest.objects.get(id=id)
    return Ok(review_request.serialized)
  except ReviewRequest.DoesNotExist:
    return NotFound()

@method("GET")
@logged_in()
def get_claimed_review_requests(request):
  user = request.site_user
  review_requests = ReviewRequest.objects.prefetched.filter(
    claimed_by=user,
    article=None,
  )
  return Ok([r.serialized for r in review_requests])

@method("POST")
@logged_in()
def claim_review_request(request):
  data = request.json
  review_request_id = data.get("id")
  if not review_request_id:
    return BadRequest("No review request claimed")
  review_request = ReviewRequest.objects.get(id=review_request_id)
  if not review_request:
    return NotFound()
  review_request.claimed_by = request.site_user
  review_request.save()
  delete_cache("REVIEW-REQUESTS")
  delete_cache("REVIEW-REQUEST", id_val=review_request_id)
  delete_cache("REVIEW-REQUEST-COUNT")

  return Ok(review_request.serialized)

@method("POST")
@logged_in()
def unclaim_review_request(request):
  data = request.json
  review_request_id = data.get("id")
  user = request.site_user
  if not review_request_id:
    return BadRequest("No review request ID")
  review_request = ReviewRequest.objects.get(id=review_request_id)
  if not review_request:
    return NotFound()
  if not review_request.claimed_by:
    return BadRequest("This review request has not been claimed")
  try:
    if review_request.article:
      return BadRequest("A review has already been written for this review request")
  except ReviewRequest.article.RelatedObjectDoesNotExist:
    pass
  if review_request.claimed_by.id != user.id and review_request.created_by.id != user.id:
    return Forbidden()
  review_request.claimed_by = None
  review_request.save()
  delete_cache("REVIEW-REQUESTS")
  delete_cache("REVIEW-REQUEST", id_val=review_request_id)
  delete_cache("REVIEW-REQUEST-COUNT")

  return Ok(review_request.serialized)

@method("POST")
@logged_in("editor")
def reject_review_request(request):
  data = request.json
  review_request_id = data.get("id")
  if not review_request_id:
    return BadRequest("No review request claimed")
  try:
    review_request = ReviewRequest.objects.get(id=review_request_id)
  except ReviewRequest.DoesNotExist:
    return NotFound()
  review_request.rejected_by = request.site_user
  review_request.save()
  delete_cache("REVIEW-REQUESTS")
  delete_cache("REVIEW-REQUEST", id_val=review_request_id)
  delete_cache("REVIEW-REQUEST-COUNT")

  return Ok(review_request.serialized)

@method("POST")
@logged_in()
def cancel_review_request(request):
  user = request.site_user
  data = request.json
  review_request_id = data.get("id")
  if not review_request_id:
    return BadRequest("No review request ID")
  try:
    review_request = ReviewRequest.objects.get(id=review_request_id)
  except ReviewRequest.DoesNotExist:
    return NotFound()
  if review_request.created_by.id != user.id:
    return Forbidden()
  if review_request.claimed_by:
    return Forbidden("This review request has already been claimed")
  try:
    if review_request.article:
      return BadRequest("A review has already been written for this review request")
  except ReviewRequest.article.RelatedObjectDoesNotExist:
    pass
  review_request.delete()
  delete_cache("REVIEW-REQUESTS")
  delete_cache("REVIEW-REQUEST", id_val=review_request_id)
  delete_cache("REVIEW-REQUEST-COUNT")

  return Ok()

@method("GET")
@cached("REVIEW-REQUESTS")
def pending_review_requests(request):
  review_requests = ReviewRequest.objects \
    .prefetched \
    .filter(
      article__isnull=True,
      claimed_by=None,
      rejected_by=None,
    ) \
    .order_by("created_at")

  return Ok([r.serialized for r in review_requests])

@method("GET")
@cached("REVIEW-REQUEST-COUNT")
def count_review_requests(request):
  return Ok(ReviewRequest.objects \
    .filter(
      article__isnull=True,
      claimed_by=None,
      rejected_by=None,
    ) \
    .count())

@method("GET")
@logged_in()
def user_review_request(request):
  user = request.site_user
  review_requests = ReviewRequest.objects \
    .prefetched \
    .filter(
      article__isnull=True,
      rejected_by=None,
    ) \
    .filter(
      Q(created_by=user) |
      Q(release__primary_artist__user=user)
    ) \
    .order_by("created_at")

  return Ok([r.serialized for r in review_requests])

@method("GET")
@cached("ARTIST", id_kwarg="slug")
def artist(request, slug):
  try:
    a = Artist.objects.get(slug=slug)
  except Artist.DoesNotExist:
    return NotFound()

  return Ok(a.serialized)

@method("GET")
@cached("ARTISTS", timeout=86400)
def artists(request):
  articles = Article.cms.prefetched.exclude(review_request=None)
  artist_ids = [
    a.review_request.release.primary_artist.id
    for a in articles if a.review_request and a.review_request.release.primary_artist
  ]
  artists = Artist.objects.filter(id__in=artist_ids).order_by(Lower("name"))
  return Ok([{
    "id": a.id,
    "name": a.name,
    "slug": a.slug
  } for a in artists])
