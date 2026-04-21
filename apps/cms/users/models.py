from django.db import models

class User(models.Model):
  username = models.CharField(max_length=50)
  display_name = models.CharField(max_length=50)
  email = models.CharField(max_length=255)
  deleted = models.BooleanField(default=False)

  def __str__(self):
    return self.username
