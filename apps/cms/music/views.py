from django.db.models import Q
from django.db import transaction
from app.http import Ok, BadRequest, NotFound, Forbidden
from app.decorators import logged_in, method
from .bandcamp import get_release_details, BandcampError
from .models import Release, ReviewRequest

@logged_in()
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
  if not url:
    return BadRequest("URL is required")
  try:
    release = Release.bandcamp.get_from_url(url)
  except ValueError:
    return BadRequest("Could not get release from URL")

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

  artist = release.artist
  if artist and not artist.user:
    artist.user = user
    artist.save()
  elif artist and not artist.user.id == user.id:
    return BadRequest("This release belongs to another user")

  if ReviewRequest.objects.filter(release=release).exists():
    return BadRequest("This release has already been requested for review")

  review_request = ReviewRequest.objects.create(
    release=release,
    created_by=user,
  )

  return Ok(review_request.serialized)

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

  return Ok(review_request.serialized)

@method("POST")
@logged_in("editor")
def reject_review_request(request):
  data = request.json
  review_request_id = data.get("id")
  if not review_request_id:
    return BadRequest("No review request claimed")
  review_request = ReviewRequest.objects.get(id=review_request_id)
  if not review_request:
    return NotFound()
  review_request.rejected_by = request.site_user
  review_request.save()

  return Ok(review_request.serialized)

@method("GET")
@logged_in()
def pending_review_requests(request):
  review_requests = ReviewRequest.objects \
    .select_related(
      "release",
      "release__primary_artist__user",
      "release__label",
      "created_by",
    ) \
    .prefetch_related("article") \
    .filter(
      article__isnull=True,
      claimed_by=None,
      rejected_by=None,
    ) \
    .order_by("created_at")

  return Ok([request.serialized for request in review_requests])
