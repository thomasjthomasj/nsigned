from django.db import models
from app.models import Creatable

class ImageUpload(Creatable):
  filetype = models.CharField(max_length=3, choices=(
    ("jpg", "jpg"),
  ))
  lg_location = models.CharField(max_length=1000, unique=True)
  md_location = models.CharField(max_length=1000, unique=True)
  sm_location = models.CharField(max_length=1000, unique=True)
