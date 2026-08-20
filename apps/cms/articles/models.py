from datetime import datetime, timezone
from django.db import models, transaction
from django.db.models import Q
from django.utils.functional import cached_property
from app.models import Creatable
from app.utils import parse_markdown, has_permission
from music.models import ReviewRequest
from .utils import get_content, parse_search_terms

class ArticleManager(models.Manager):
  @property
  def prefetched_w_deleted(self):
    return self.prefetch_related("contents") \
      .select_related("created_by") \
      .select_related("created_by__fundraiser_link") \
      .select_related("review_request") \
      .select_related("review_request__release") \

  @property
  def prefetched(self):
    return self.prefetched_w_deleted.filter(deleted=False)

  def search(self, terms):
    parsed_terms = parse_search_terms(terms)
    terms = parsed_terms["terms"]
    artist = parsed_terms["artist"]
    author = parsed_terms["author"]
    from_date = parsed_terms["from"]
    to_date = parsed_terms["to"]
    query = self.prefetched.distinct()

    for term in terms:
      query = query.filter(
        Q(title__icontains=term) |
        (Q(contents__active=True) & Q(contents__content__icontains=term))
      )
    if artist:
      query = query.filter(
        Q(review_request__release__primary_artist__slug=artist) |
        Q(review_request__release__primary_artist__name=artist)
      )
    if author:
      query = query.filter(
        Q(created_by__username=author) |
        Q(created_by__display_name=author)
      )
    parse_date = lambda date: datetime.strptime(date, "%Y-%m-%d")
    if from_date:
      try:
        date = parse_date(from_date)
        query = query.filter(created_at__gte=date)
      except (ValueError, TypeError):
        pass
    if to_date:
      try:
        date = parse_date(to_date)
        query = query.filter(created_at__lte=date)
      except (ValueError, TypeError):
        pass
    return query

  @transaction.atomic
  def create(self, **kwargs):
    data = {
      k: kwargs[k]
      for k in ("title", "slug", "created_by", "review_request")
      if kwargs[k]
    }

    article = super().create(published_at=datetime.now(timezone.utc), **data)
    ArticleContent.objects.create(
      content=kwargs["content"].strip(),
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
  deleted_reason = models.TextField(null=True, blank=True)
  review_request = models.OneToOneField(
    ReviewRequest,
    null=True,
    on_delete=models.SET_NULL,
    default=None,
    blank=True,
  )

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
      "requested_by": self.review_request.created_by.serialized if self.review_request else None,
      "published_at": self.published_at.isoformat() if self.published_at else None,
      "created_by": self.created_by.serialized,
      "created_at": self.created_at.isoformat(),
    }

  @cached_property
  def serialized(self):
    article = self.serialized_lite
    content = get_content(self.contents)
    return article | {
      "content": {
        "id": content.id,
        "content": parse_markdown(content.content, has_permission(self.created_by, "editor")),
        "raw": content.content,
      } if content else None,
      "deleted": self.deleted,
      "deleted_reason": self.deleted_reason,
    }

  @transaction.atomic()
  def update_content(self, content, user):
    self.contents.update(active=False)
    ArticleContent.objects.create(
      article=self,
      content=content,
      created_by=user,
      active=True,
    )

class ArticleContent(Creatable):
  article = models.ForeignKey(
    Article,
    on_delete=models.CASCADE,
    related_name="contents",
  )
  content = models.TextField()
  active = models.BooleanField(default=True)

class CommentManager(models.Manager):
  @property
  def prefetched(self):
    return self.filter(deleted=False) \
      .prefetch_related("contents") \
      .select_related("created_by", "article")

class Comment(Creatable):
  article = models.ForeignKey(
    Article,
    on_delete=models.CASCADE,
    related_name="comments"
  )
  deleted = models.BooleanField(default=False)
  idempotency_key = models.CharField(max_length=255, unique=True)

  objects = CommentManager()

  @cached_property
  def serialized(self):
    content = get_content(self.contents)
    return {
      "id": self.id,
      "created_by": self.created_by.serialized,
      "created_at": self.created_at.isoformat(),
      "content": parse_markdown(content.content, has_permission(self.created_by, "editor")),
    }

class CommentContent(Creatable):
  comment = models.ForeignKey(
    Comment,
    on_delete=models.CASCADE,
    related_name="contents"
  )
  content = models.TextField()
  active = models.BooleanField(default=True)

class Bookmark(Creatable):
  article = models.ForeignKey(
    Article,
    on_delete=models.CASCADE,
    related_name="bookmarks",
  )

  class Meta:
    constraints = [
      models.UniqueConstraint(
        fields=["created_by", "article"],
        name="unique_bookmark_per_user_article",
      )
    ]

  def __str__(self):
    return f"{self.created_by.username} - {self.article.title}"
