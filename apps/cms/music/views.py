from django.conf import settings
from django.db.models import Q
from django.db import transaction
from django.db.models.functions import Lower
from slugify import slugify
from app.http import Ok, BadRequest, NotFound, Forbidden, InternalServerError
from app.decorators import logged_in, method, cached
from app.exceptions import MaxIterationError
from app.s3 import s3_audio
from app.utils import delete_cache
from articles.models import Article
from images.models import ImageUpload
from .bandcamp import get_release_details, BandcampError
from .models import Artist, Release, ReviewRequest, Track

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

@method("POST")
@logged_in()
@transaction.atomic()
def start_upload(request):
  data = request.json
  user = request.site_user
  artist_id = data.get("artist_id")
  artist_name = data.get("artist_name")
  track_title = data.get("track_title")
  genre = data.get("genre")

  if not track_title or not (artist_id or artist_name):
    return BadRequest()

  artist = None
  if artist_id:
    try:
      artist = Artist.objects.get(id=artist_id, user=user)
    except Artist.DoesNotExist:
      return NotFound()
  elif artist_name:
    try:
      artist = Artist.objects.resolve_user_artist(name=artist_name, user=user)
    except MaxIterationError:
      return BadRequest("Could not resolve artist")

  track_slug = slugify(track_title)
  release = Release.objects.create(
    created_by=user,
    primary_artist=artist,
    title=track_title,
    slug=track_slug,
    release_type="track",
    genre=genre,
    source="nsigned",
    images={},
    status="incomplete",
  )

  key = f"{artist.slug}/{release.id}/{track_slug}"

  wav_location = f"audio/raw/{key}.wav"
  mp3_location = f"audio/mp3s/{key}.mp3"

  track = Track.objects.create(
    created_by=user,
    release=release,
    title=track_title,
    wav_location=wav_location,
    mp3_location=mp3_location,
    track_number=1,
    status="processing"
  )

  presigned_url = s3_audio.generate_presigned_url(
    "put_object",
    Params={
      "Bucket": "nsigned",
      "Key": wav_location,
      "ContentType": "audio/wav",
    },
    ExpiresIn=3600,
  )

  return Ok({
    "upload_url": presigned_url,
    "track_id": track.id,
    "release_id": release.id,
  })

@method("POST")
@logged_in()
def attach_images(request, release_id, image_upload_id):
  asset_url = settings.AWS_S3_PUBLIC_URL
  # Image sizes
  LG = 1200
  MD = 350
  SM = 124
  user = request.site_user

  try:
    release = Release.objects.get(created_by=user, id=release_id)
    image_upload = ImageUpload.objects.get(created_by=user, id=image_upload_id)
  except (Release.DoesNotExist, ImageUpload.DoesNotExist) as e:
    return NotFound()

  release.images = {
    "lg": {
      "url": f"{asset_url}{image_upload.lg_location}",
      "width": LG,
      "height": LG,
    },
    "md": {
      "url": f"{asset_url}{image_upload.md_location}",
      "width": MD,
      "height": MD,
    },
    "sm": {
      "url": f"{asset_url}{image_upload.sm_location}",
      "width": SM,
      "height": SM,
    },
  }
  release.status = "complete"
  release.save()
  return Ok(release.serialized)

@method("GET")
@logged_in()
def mp3_status(request, id):
  user = request.site_user
  try:
    track = Track.objects.get(id=id, created_by=user)
  except Track.DoesNotExist:
    return NotFound()

  try:
    s3_audio.head_object(
      Bucket="nsigned",
      Key=track.mp3_location,
    )
    track.status = "complete"
    track.save()
    return Ok({ "status": track.status })
  except s3_audio.exceptions.ClientError as e:
    error_code = e.response["Error"]["Code"]
    if error_code == "404":
      if track.status == "complete":
        track.status = "removed"
        track.save()
      return Ok({ "status": track.status })
    return InternalServerError("Could not check track status")

@method("GET")
@cached("RELEASE", id_kwarg="id")
def release(request, id):
  try:
    release = Release.objects.get(id=id, status="complete")
  except Release.DoesNotExist:
    return NotFound()
  return Ok(release.serialized)

@method("GET")
@cached("TRACKS")
def tracks(request):
  tracks = Track.objects.prefetched.all()
  return Ok([t.serialized for t in tracks])

@cached("TRACK", id_kwarg="id", timeout=3600)
def mp3_url(request, id):
  track = Track.objects.get(id=id)
  if not track or track.status == "removed":
    return NotFound()
  if track.status == "processing":
    return BadRequest("Track is not ready")

  try:
    url = s3_audio.generate_presigned_url(
      "get_object",
      Params={
        "Bucket": "nsigned",
        "Key": track.mp3_location,
      },
      ExpiresIn=3600*2,
    )
  except s3_audio.exceptions.ClientError as e:
    error_code = e.response["Error"]["Code"]
    if error_code == "404":
      track.status = "removed"
      track.save()
      return NotFound()
    return InternalServerError("Could not get track URL")

  return Ok({ "url": url })
