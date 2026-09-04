from django.urls import path

from . import views

urlpatterns = [
  path("start-upload", views.start_upload, name="start_upload"),
]
