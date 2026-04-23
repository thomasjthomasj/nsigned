from django.db import models
from users.models import User

class Creatable(models.Model):
  created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    abstract = True
