from django.db import models
from app.models import Creatable
from links.models import Link

class Artist(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  links = models.ManyToManyField(Link)

class Label(Creatable):
  name = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  links = models.ManyToManyField(Link)

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
  name = models.CharField(max_length=1000)
  slug = models.CharField(max_length=255)
  links = models.ManyToManyField(Link)
  release_date = models.DateTimeField(null=True)
  release_type = models.CharField(
    max_length=255,
    choices=(
      ("album", "Album"),
      ("track", "Track"),
    )
  )
