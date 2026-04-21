from django.db import models, transaction
from users.models import User

class ArticleManager(models.Manager):
  @transaction.atomic
  def create(self, **kwargs):
    article = Article.objects.create(
      title=kwargs.title,
      slug=kwargs.slug,
      author=kwargs.author,
    )
    ArticleContent.objects.create(
      content=kwargs.content,
      article=article,
      active=True,
    )

    return Article.objects \
      .prefetch_related("articlecontent_set") \
      .select_related("author") \
      .get(pk=article)

class Article(models.Model):
  author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
  title = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  external_link = models.CharField(max_length=1000)
  created_at = models.DateTimeField(auto_now_add=True)
  published_at = models.DateTimeField(null=True)

  def __str__(self):
    return self.title

  objects = ArticleManager()

class ArticleContent(models.Model):
  article = models.ForeignKey(Article, on_delete=models.CASCADE)
  content = models.TextField()
  active = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)
