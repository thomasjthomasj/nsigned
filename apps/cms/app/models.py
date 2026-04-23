from django.db import models
from users.models import User

class Creatable(models.Model):
  created_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    abstract = True
