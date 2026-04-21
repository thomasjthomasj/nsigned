from django.db import models

class Article(models.Model):
  title = models.CharField(max_length=255)
  external_link = models.CharField(max_length=1000)
  published_at = models.DateTimeField(auto_now_add=True)

class ArticleContent(models.Model):
  article = models.ForeignKey(Article, on_delete=models.CASCADE)
  content = models.TextField()
  active = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)
