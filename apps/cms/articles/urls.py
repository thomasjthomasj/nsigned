from django.urls import path

from . import views

app_name = "articles"

urlpatterns = [
  path("", views.index, name="index"),
  path("<int:article_id>", views.article, name="article"),
  path("create", views.create, name="create"),
  path("<int:article_id>", views.update, name="update"),
]
