from datetime import datetime, timedelta, timezone
from django.db import models, transaction
from django.utils.functional import cached_property
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import check_password
from django.core.exceptions import PermissionDenied
from app.utils import delete_cache
from .utils import get_otp

class UserManager(BaseUserManager):
  def create_user(self, username, email, password, **kwargs):
    if not email:
      raise ValueError("Email is required")
    if not username:
      raise ValueError("Username is required")

    user = self.model(
      email=self.normalize_email(email),
      username=username,
      **kwargs
    )
    user.set_password(password)
    user.save()
    return user

  def authenticate(self, password, username_or_email):
    if not username_or_email:
      raise ValueError("Either a username or email must be provided")
    user = None
    for kwargs in ({ "username": username_or_email }, { "email": username_or_email }):
      try:
        user = super().get(**kwargs)
      except User.DoesNotExist:
        pass

    if not user:
      raise PermissionDenied

    if not check_password(password, user.password):
      raise PermissionDenied

    return user

class User(AbstractBaseUser):
  username = models.CharField(max_length=50, unique=True)
  display_name = models.CharField(max_length=50, null=True)
  email = models.EmailField(unique=True)
  role = models.CharField(max_length=20, choices=(
    ("contributor", "Contributor"),
    ("editor", "Editor"),
    ("admin", "Admin"),
  ), default="contributor")
  bio = models.TextField(null=True, blank=True)
  fundraiser_link = models.ForeignKey(
    "links.Link",
    null=True,
    blank=True,
    on_delete=models.CASCADE,
    related_name="fundraiser_owners",
  )
  password_expiry = models.DateTimeField(auto_now_add=True)
  can_email = models.BooleanField(null=True, default=None, blank=True)
  pronouns = models.CharField(max_length=50, null=True, blank=True)

  USERNAME_FIELD = "username"
  REQUIRED_FIELDS = ["username", "email"]

  def __str__(self):
    return self.username

  objects = UserManager()

  @cached_property
  def serialized(self):
    return {
      "id": self.id,
      "username": self.username,
      "display_name": self.display_name,
      "role": self.role,
      "fundraiser_link": self.fundraiser_link.url if self.fundraiser_link else None,
      "can_email": self.can_email,
      "pronouns": self.pronouns,
    }

  def update_otp(self):
    otp = get_otp()
    self.set_password(otp)
    self.password_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)
    self.save()
    return otp

class NotificationManager(models.Manager):
  @transaction.atomic()
  def create_notification(self, user, text, link):
    notification = self.create(user=user, text=text, link=link)
    delete_cache("NOTIFICATIONS", id_val=user.id)
    return notification

class Notification(models.Model):
  user = models.ForeignKey(User, related_name="notifications", on_delete=models.CASCADE)
  read = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  text = models.CharField(max_length=1000)
  link = models.CharField(max_length=1000, null=True, blank=True)

  objects = NotificationManager()

  @cached_property
  def serialized(self):
    return {
      "id": self.id,
      "user_id": self.user.id,
      "created_at": self.created_at.isoformat(),
      "text": self.text,
      "link": self.link,
    }

  def __str__(self):
    return f"{self.user.username} - {self.text}"
