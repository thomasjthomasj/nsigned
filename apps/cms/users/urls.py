from django.urls import path

from . import views

app_name = "users"

urlpatterns = [
  path("get/<str:username>", views.get_user, name="get_user"),
  path("me", views.get_me, name="get_me"),
  path("register", views.register, name="register"),
  path("update", views.update, name="update"),
  path("login", views.login, name="login"),
  path("logout", views.logout, name="logout"),
  path("refresh", views.refresh_token, name="refresh_token"),
]
