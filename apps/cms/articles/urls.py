from django.urls import path

from . import views

app_name = "articles"

urlpatterns = [
  path("", views.list, name="list"),
  path("<int:article_id>", views.article, name="article"),
  path("<int:article_id>/comment", views.comment, name="comment"),
  path("<int:article_id>/comments", views.get_comments, name="get_comments"),
  path("create", views.create, name="create"),
]
