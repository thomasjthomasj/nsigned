from django.urls import path

from . import views

app_name = "articles"

urlpatterns = [
  path("", views.list, name="list"),
  path("random", views.random, name="random"),
  path("<int:article_id>", views.article, name="article"),
  path("<int:article_id>/update", views.update, name="update"),
  path("<int:article_id>/delete", views.delete, name="delete"),
  path("<int:article_id>/comment", views.comment, name="comment"),
  path("<int:article_id>/comments", views.get_comments, name="get_comments"),
  path("<int:article_id>/revalidate", views.revalidate_images, name="revalidate_images"),
  path("create", views.create, name="create"),
  path("sitemap", views.sitemap, name="sitemap"),
]
