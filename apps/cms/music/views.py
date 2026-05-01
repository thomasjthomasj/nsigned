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

  return Ok({
    "review_request": {
      "id": review_request.id,
      "release": {
        "primary_artist": {
          "id": release.primary_artist.id,
          "name": release.primary_artist.name,
          "slug": release.primary_artist.slug,
        },
        "label": {
          "id": release.label.id,
          "name": release.label.name,
          "slug": release.label.slug,
        } if release.get("label") else None,
        "links": [{
          "id": l.id,
          "url": l.url,
        } for l in release.links],
        "image_url": {
          "id": release.image_url.id,
          "url": release.image_url.url,
        } if release.get("image_url") else None,
        "release_type": release.release_type,
      },
      "created_by": {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
      }
    }
  })
