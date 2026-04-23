import re
from django.db import models, transaction
from datetime import datetime
from slugify import slugify
from app.models import Creatable
from app.utils import strip_url_query
from links.models import Link
from music.bandcamp import bandcamp

class Artist(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  links = models.ManyToManyField(Link)
  bandcamp_id = models.IntegerField(null=True, unique=True)

class Label(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  links = models.ManyToManyField(Link)
  bandcamp_id = models.IntegerField(null=True, unique=True)

class ReleaseBandcampManager(models.Manager):
  @transaction.atomic
  def get_from_url(self, url):
    url = strip_url_query(url)
    pattern = r"^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/(album|track)\/"
    print(url)
    match = re.match(pattern, url)
    if not match:
      raise ValueError("Not a valid Bandcamp release URL")

    existing = super().filter(links__url=url).first()
    if existing:
      return existing

    release_type = match.group(1)
    link, link_created = Link.objects.get_or_create(url=url)
    artist = None
    label = None
    image_url = None

    bc_release = bandcamp.get_album(album_url=url) if release_type == "album" \
      else bandcamp.get_track(track_url=url)

    if not bc_release:
      raise ValueError("Could not load Bandcamp release data from URL")

    if bc_release.art_url:
      image_url, img_created = Link.objects.get_or_create(url=bc_release.art_url)

    bc_artist_id = bc_release.artist_id
    if bc_artist_id and bc_release.artist_title:
      artist, artist_created = Artist.objects.get_or_create(
        bandcamp_id=bc_artist_id,
        defaults={
          "name": bc_release.artist_title,
          "slug": slugify(bc_release.artist_title)
        },
      )

    bc_label_id = bc_release.record_label_id
    if bc_label_id and bc_release.record_label_title:
      label, label_created = Label.objects.get_or_create(
        bandcamp_id=bc_label_id,
        defaults={
          "name": bc_release.record_label_title,
          "slug": slugify(bc_release.record_label_title),
        }
      )

    return super().create(
      primary_artist=artist,
      label=label,
      title=bc_release.album_title,
      slug=slugify(bc_release.album_title)[:255],
      links=[link],
      image_url=image_url,
      release_date=datetime.fromtimestamp(bc_release.date_released_unix),
      release_type=release_type,
    )

class Release(Creatable):
  primary_artist = models.ForeignKey(
    Artist,
    null=True,
    on_delete=models.SET_NULL,
    related_name="releases"
  )
  label = models.ForeignKey(
    Label,
    null=True,
    on_delete=models.SET_NULL,
    related_name="releases"
  )
  title = models.CharField(max_length=1000)
  slug = models.CharField(max_length=255)
  links = models.ManyToManyField(Link, through="ReleaseLink", related_name="release_links")
  image_url = models.ForeignKey(Link, null=True, on_delete=models.CASCADE)
  release_date = models.DateTimeField(null=True)
  release_type = models.CharField(
    max_length=255,
    choices=(
      ("album", "Album"),
      ("track", "Track"),
    )
  )

  objects = models.Manager()
  bandcamp = ReleaseBandcampManager()

class ReleaseLink(models.Model):
  release = models.ForeignKey(Release, on_delete=models.CASCADE)
  link = models.ForeignKey(Link, on_delete=models.CASCADE)

  class Meta:
    constraints = [
      models.UniqueConstraint(
        fields=["link"],
        name="unique_link_per_release",
      )
    ]
