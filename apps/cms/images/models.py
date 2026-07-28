from django.db import models
from app.models import Creatable

class ImageUpload(Creatable):
  filetype = models.CharField(max_length=3, choices=(
    ("jpg", "jpg"),
    ("png", "png"),
  ))
  src_location = models.CharField(max_length=1000, unique=True)
  lg_location = models.CharField(max_length=1000, unique=True)
  md_location = models.CharField(max_length=1000, unique=True)
  sm_location = models.CharField(max_length=1000, unique=True)

  def __str__(self):
    return self.lg_location

  @property
  def serialized(self):
    return {
      "created_by": self.created_by.serialized,
      "filetype": self.filetype,
      "lg_location": self.lg_location,
      "md_location": self.md_location,
      "sm_location": self.sm_location,
    }
