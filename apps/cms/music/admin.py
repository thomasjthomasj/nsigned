from django.contrib import admin

from .models import Artist, Label, Release, ReviewRequest, Track

for model in (Artist, Label, Release, ReviewRequest, Track):
  admin.site.register(model)
