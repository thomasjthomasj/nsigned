from django.urls import path

from . import views

app_name = "articles"

urlpatterns = [
  path("", views.list, name="list"),
  path("<int:article_id>", views.article, name="article"),
  path("create", views.create, name="create"),
]
