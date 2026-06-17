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
  path("<int:article_id>/bookmark", views.bookmark, name="bookmark"),
  path("<int:article_id>/bookmark/delete", views.delete_bookmark, name="delete_bookmark"),
  path("bookmarks", views.bookmarks, name="bookmarks"),
  path("bookmarks/ids", views.bookmarked_ids, name="bookmarked_ids"),
  path("create", views.create, name="create"),
  path("sitemap", views.sitemap, name="sitemap"),
]
