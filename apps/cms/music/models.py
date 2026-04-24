import re
import requests
from django.db import models, transaction
from datetime import datetime
from slugify import slugify
from app.models import Creatable
from app.utils import strip_url_query
from links.models import Link
from music.bandcamp import get_release_details
from bs4 import BeautifulSoup


class Artist(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255, unique=True)
  links = models.ManyToManyField(Link)

  def __str__(self):
    return self.name

class Label(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255, unique=True)
  links = models.ManyToManyField(Link)

  def __str__(self):
    return self.name

class ReleaseBandcampManager(models.Manager):
  @transaction.atomic
  def get_from_url(self, url):
    base_url = strip_url_query(url)
    pattern = r"^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/(album|track)\/"
    match = re.match(pattern, base_url)
    if not match:
      raise ValueError("Not a valid Bandcamp release URL")

    existing = super().filter(links__url=base_url).first()
    if existing:
      return existing

    bc_data = get_release_details(base_url)
    artist_name = bc_data["artist_name"]
    title = bc_data["title"]
    label_name = bc_data["label"]
    image_url_string = bc_data["image_url"]
    release_type = bc_data["release_type"]

    link, link_created = Link.objects.get_or_create(url=base_url)

    if image_url_string:
      image_url, img_created = Link.objects.get_or_create(url=image_url_string)

    artist, artist_created = Artist.objects.get_or_create(
      slug=slugify(artist_name),
      defaults={
        "name": artist_name,
      },
    )

    if label_name:
      label, label_created = Label.objects.get_or_create(
        slug=slugify(label_name),
        defaults={
          "name": label_name
        }
      )
    else:
      label = None

    release = super().create(
      primary_artist=artist,
      title=title,
      slug=slugify(title)[:255],
      label=label,
      image_url=image_url,
      release_type=release_type,
    )

    ReleaseLink.objects.create(release=release, link=link)

    return super() \
      .prefetch_related("links") \
      .select_related("primary_artist", "label", "image_url") \
      .get(pk=release.id)

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
  slug = models.CharField(max_length=255, unique=True)
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

  def __str__(self):
    return f"{self.primary_artist.name} - {self.title}"

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
