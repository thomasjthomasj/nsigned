from django.urls import path

from . import views

app_name = "music"

urlpatterns = [
  path("request-review", views.request_review, name="request_review")
]
