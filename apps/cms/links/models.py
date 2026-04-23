from django.db import models
from app.models import Creatable

class Link(Creatable):
  url = models.CharField(max_length=255, unique=True)
