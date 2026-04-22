from django.db import models, transaction
from django.core.exceptions import NotFound
from users.models import User

class ArticleManager(models.Manager):
  @transaction.atomic
  def create(self, **kwargs):
    article = super().create(
      title=kwargs["title"],
      slug=kwargs["slug"],
      author=kwargs["author"],
    )
    ArticleContent.objects.create(
      content=kwargs["content"],
      article=article,
      active=True,
    )

    return Article.objects \
      .prefetch_related("articlecontent_set") \
      .select_related("author") \
      .get(pk=article.id)

class Article(models.Model):
  author = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
  title = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  external_link = models.CharField(max_length=1000)
  created_at = models.DateTimeField(auto_now_add=True)
  published_at = models.DateTimeField(null=True)

  def __str__(self):
    return self.title

  cms = ArticleManager()

  @transaction.atomic
  def update(self, **kwargs):
    if kwargs["title"]:
      self.title = kwargs["title"]
    if kwargs["slug"]:
      self.slug = kwargs["slug"]
    if kwargs["author"]:
      self.author = kwargs.author
    self.save()
    if kwargs["content"]:
      self.articlecontent_set.update(active=False)
      Article.objects.create(
        content=kwargs["content"],
        article=self,
        active=True
      )

class ArticleContent(models.Model):
  article = models.ForeignKey(Article, on_delete=models.CASCADE)
  content = models.TextField()
  active = models.BooleanField(default=True)
  created_at = models.DateTimeField(auto_now_add=True)
