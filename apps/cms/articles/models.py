from django.db import models, transaction
from app.models import Creatable
from music.models import Release
from links.models import Link

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
      .prefetch_related("contents") \
      .select_related("author") \
      .get(pk=article.id)

class Article(Creatable):
  title = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  release = models.ForeignKey(
    Release,
    null=True,
    on_delete=models.SET_NULL,
    related_name="articles",
  )
  published_at = models.DateTimeField(null=True)
  release = models.ForeignKey

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

class ArticleContent(Creatable):
  article = models.ForeignKey(
    Article,
    on_delete=models.CASCADE,
    related_name="contents",
  )
  content = models.TextField()
  active = models.BooleanField(default=True)
