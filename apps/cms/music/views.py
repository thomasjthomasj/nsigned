from django.db import transaction
from app.http import Ok, BadRequest
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

  if ReviewRequest.objects.filter(release=release).exists():
    return BadRequest("This release has already been requested for review")

  review_request = ReviewRequest.objects.create(
    release=release,
    created_by=user,
  )

  return Ok(review_request.serialized)
