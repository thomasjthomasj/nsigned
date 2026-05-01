from django.db import models
from django.utils.functional import cached_property
from app.models import Creatable

class Link(Creatable):
  url = models.CharField(max_length=255, unique=True)

  def __str__(self):
    return self.url

  @cached_property
  def serialized(self):
    return {
      "id": self.id,
      "url": self.url,
    }
