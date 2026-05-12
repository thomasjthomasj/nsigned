import re
from django.db import models, transaction
from django.utils.functional import cached_property
from slugify import slugify
from app.models import Creatable
from app.utils import strip_url_query
from links.models import Link
from users.models import User
from .bandcamp import get_release_details
from .validators import images_validator

class Artist(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255, unique=True)
  links = models.ManyToManyField(Link)
  user = models.ForeignKey(
    User,
    related_name="artists",
    on_delete=models.SET_NULL,
    null=True,
  )

  def __str__(self):
    return self.name

  @cached_property
  def serialized(self):
    return {
      "id": self.id,
      "name": self.name,
      "slug": self.slug,
    }

class Label(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255, unique=True)
  links = models.ManyToManyField(Link)

  def __str__(self):
    return self.name

  @cached_property
  def serialized(self):
    return {
      "id": self.id,
      "name": self.name,
      "slug": self.slug,
    }

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
    release_type = bc_data["release_type"]

    link = Link.objects.get_or_create(url=base_url)[0]

    artist = Artist.objects.get_or_create(
      slug=slugify(artist_name),
      defaults={
        "name": artist_name,
      },
    )[0]

    if label_name:
      label = Label.objects.get_or_create(
        slug=slugify(label_name),
        defaults={
          "name": label_name
        }
      )[0]
    else:
      label = None

    release = super().create(
      primary_artist=artist,
      title=title,
      slug=slugify(title)[:255],
      label=label,
      images=bc_data["images"],
      release_type=release_type,
    )

    ReleaseLink.objects.create(release=release, link=link)

    return super() \
      .prefetch_related("links") \
      .select_related("primary_artist", "label") \
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
  links = models.ManyToManyField(Link, through="ReleaseLink", related_name="links")
  images = models.JSONField(validators=[images_validator])
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
    if self.primary_artist:
      return  f"{self.primary_artist.name} - {self.title}"
    return self.title

  @cached_property
  def serialized(self):
    return {
      "id": self.id,
      "title": self.title,
      "slug": self.slug,
      "primary_artist": self.primary_artist.serialized if self.primary_artist else None,
      "label": self.label.serialized if self.label else None,
      "links": [l.serialized for l in self.links.all()],
      "images": self.images,
      "release_type": self.release_type,
    }

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

class ReviewRequestManager(models.Manager):
  @property
  def prefetched(self):
    return self.select_related(
      "release",
      "release__primary_artist__user",
      "release__label",
      "created_by",
      "claimed_by",
      "rejected_by",
    ) \
    .prefetch_related("article")

class ReviewRequest(Creatable):
  release = models.ForeignKey(Release, on_delete=models.CASCADE)
  rejected = models.BooleanField(default=False)
  claimed_by = models.ForeignKey(
    User,
    null=True,
    on_delete=models.SET_NULL,
    related_name="claimed_review_requests",
  )
  rejected_by = models.ForeignKey(
    User,
    null=True,
    on_delete=models.SET_NULL,
    related_name="rejected_review_requests",
  )

  objects = ReviewRequestManager()

  def __str__(self):
    return f"{self.release}"

  @cached_property
  def serialized(self):
    return {
      "id": self.id,
      "release": self.release.serialized,
      "created_by": self.created_by.serialized if self.created_by else None,
      "created_at": self.created_at.isoformat(),
      "article": self.article.serialized if hasattr(self, "article") else None,
      "claimed_by": self.claimed_by.serialized if self.claimed_by else None,
      "rejected_by": self.rejected_by.serialized if self.rejected_by else None,
    }
