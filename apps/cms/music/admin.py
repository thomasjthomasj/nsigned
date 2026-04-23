from django.contrib import admin

from .models import Artist, Label, Release

for model in (Artist, Label, Release):
  admin.site.register(model)
