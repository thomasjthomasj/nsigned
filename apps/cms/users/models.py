from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import check_password
from django.core.exceptions import PermissionDenied

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

  def authenticate(self, password, **kwargs):
    email = kwargs["email"]
    username = kwargs["username"]
    if not email and not username:
      raise ValueError("Either a username or email must be provided")
    get_kwargs = { "username": username } if username else { "email": email }
    try:
      user = super().get(**get_kwargs)
    except User.DoesNotExist:
      raise PermissionDenied

    if not check_password(password, user.password):
      return None

    return user

class User(AbstractBaseUser):
  username = models.CharField(max_length=50, unique=True)
  display_name = models.CharField(max_length=50)
  email = models.EmailField(unique=True)
  role = models.CharField(max_length=20, choices=(
    ("user", "User"),
    ("contributor", "Contributor"),
    ("editor", "Editor"),
  ), default="user")

  USERNAME_FIELD = "username"
  REQUIRED_FIELDS = ["username", "email"]

  def __str__(self):
    return self.username

  objects = UserManager()
