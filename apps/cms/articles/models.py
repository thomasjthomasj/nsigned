from django.db import models
from users.models import User

class Article(models.Model):
  author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
  title = models.CharField(max_length=255)
  external_link = models.CharField(max_length=1000)
  published_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title

class ArticleContent(models.Model):
  article = models.ForeignKey(Article, on_delete=models.CASCADE)
  content = models.TextField()
  active = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)
