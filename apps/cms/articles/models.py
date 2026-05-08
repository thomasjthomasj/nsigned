from datetime import datetime, timezone
from django.db import models, transaction
from django.utils.functional import cached_property
from app.models import Creatable
from music.models import ReviewRequest
from .utils import parse_markdown

class ArticleManager(models.Manager):
  @property
  def prefetched(self):
    return super() \
      .filter(deleted=False) \
      .prefetch_related("contents") \
      .select_related("created_by") \
      .select_related("review_request") \
      .select_related("review_request__release") \

  @transaction.atomic
  def create(self, **kwargs):
    data = {
      k: kwargs[k]
      for k in ("title", "slug", "created_by", "review_request")
      if kwargs[k]
    }

    article = super().create(published_at=datetime.now(timezone.utc), **data)
    ArticleContent.objects.create(
      content=kwargs["content"],
      article=article,
      active=True,
      created_by=kwargs["created_by"],
    )

    return self.prefetched.get(pk=article.id)

class Article(Creatable):
  title = models.CharField(max_length=255)
  slug = models.CharField(max_length=255)
  published_at = models.DateTimeField(null=True)
  deleted = models.BooleanField(default=False)
  review_request = models.OneToOneField(ReviewRequest, null=True, on_delete=models.SET_NULL)

  def __str__(self):
    return self.title

  objects = models.Manager()
  cms = ArticleManager()

  @cached_property
  def serialized_lite(self):
    return {
      "id": self.id,
      "title": self.title,
      "slug": self.slug,
      "release": self.review_request.release.serialized if self.review_request else None,
      "published_at": self.published_at.isoformat() if self.published_at else None,
      "created_by": self.created_by.serialized,
      "created_at": self.created_at.isoformat(),
    }

  @cached_property
  def serialized(self):
    article = self.serialized_lite
    content = next(
      content for content in self.contents.all() if content.active
    )
    return article | { "content": {
      "id": content.id,
      "content": parse_markdown(content.content)
    } if content else None }

class ArticleContent(Creatable):
  article = models.ForeignKey(
    Article,
    on_delete=models.CASCADE,
    related_name="contents",
  )
  content = models.TextField()
  active = models.BooleanField(default=True)
