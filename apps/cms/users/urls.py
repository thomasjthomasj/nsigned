from django.urls import path

from . import views

app_name = "users"

urlpatterns = [
  path("get/<str:username>", views.get_user, name="get_user"),
  path("exists", views.exists, name="exists"),
  path("me", views.get_me, name="get_me"),
  path("register", views.register, name="register"),
  path("update", views.update, name="update"),
  path("login", views.login, name="login"),
  path("logout", views.logout, name="logout"),
  path("refresh", views.refresh_token, name="refresh_token"),
  path("request-otp", views.request_otp, name="request_otp"),
  path("email-consent", views.email_consent, name="email_consent"),
  path("send-email-consent", views.send_email_consent, name="send_email_consent"),
  path("notifications", views.notifications, name="notifications"),
  path("notifications/mark-read", views.mark_notifications_read, name="mark_notifications_read"),
]
