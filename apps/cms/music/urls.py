from django.urls import path

from . import views

app_name = "music"

urlpatterns = [
  path("release-details", views.release_details, name="release_details"),
  path("request-review", views.request_review, name="request_review"),
]
