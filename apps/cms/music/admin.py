from django.contrib import admin

from .models import Artist, Label, Release, ReviewRequest

for model in (Artist, Label, Release, ReviewRequest):
  admin.site.register(model)
