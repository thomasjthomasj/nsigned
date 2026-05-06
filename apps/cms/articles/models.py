from datetime import datetime
from django.db import models, transaction
from django.utils.functional import cached_property
from app.models import Creatable
from music.models import Release, ReviewRequest
from links.models import Link
from .utils import article_json

class ArticleManager(models.Manager):
  @transaction.atomic
  def create(self, **kwargs):
    data = {
      k: kwargs[k]
      for k in ("title", "slug", "created_by")
      if kwargs[k]
    }
    if kwargs["external_link"]:
      url = kwargs["external_link"]
      link = Link.objects.get_or_create(url=url)[0]
      release = Release.objects.filter(links=link).first()
      data["external_link"] = link
      if release:
        data["release"] = release
    article = super().create(published_at=datetime.now(), **data)
    ArticleContent.objects.create(
      content=kwargs["content"],
      article=article,
      active=True,
    )

    return Article.objects \
      .prefetch_related("contents") \
      .select_related("created_by",
        "external_link",
        "release",
      ) \
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
  external_link = models.ForeignKey(Link, null=True, on_delete=models.SET_NULL)
  published_at = models.DateTimeField(null=True)
  review_request = models.OneToOneField(ReviewRequest, null=True, on_delete=models.SET_NULL)

  def __str__(self):
    return self.title

  objects = models.Manager()
  cms = ArticleManager()

  @cached_property
  def serialized(self):
    return article_json(self)

  @cached_property
  def serialized_lite(self):
    return {
      "id": self.id,
      "title": self.title,
      "slug": self.slug,
      "release": self.release.serialized if self.release else None,
      "published_at": self.published_at.isotime() if self.published_at else None,
      "created_by": self.created_by.serialized,
      "created_at": self.created_at.isotime(),
    }

class ArticleContent(Creatable):
  article = models.ForeignKey(
    Article,
    on_delete=models.CASCADE,
    related_name="contents",
  )
  content = models.TextField()
  active = models.BooleanField(default=True)
