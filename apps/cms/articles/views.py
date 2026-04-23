from slugify import slugify
from django.db import transaction
from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, Http404
from django.core.exceptions import BadRequest, PermissionDenied
from music.models import Release
from users.models import User
from .models import Article
from .utils import article_json

def index(request):
  return HttpResponse("This is the articles index.")

def article(request, article_id):
  article = Article.objects \
    .prefetch_related("contents") \
    .select_related("created_by") \
    .select_related("external_link") \
    .select_related("release") \
    .get(pk=article.id)
  if not article:
    return Http404("Not found")

  return JsonResponse(article_json(article))

def create(request):
  if request.method == "GET":
    return HttpResponseNotAllowed()

  # TODO proper user system
  author_id = request.POST.get("author_id")
  try:
    created_by = User.objects.get(pk=author_id)
  except User.DoesNotExist:
    raise PermissionDenied

  content = request.POST.get("content")
  title = request.POST.get("title")
  external_link = request.POST.get("external_link")
  release = None
  if not content or not title:
    raise BadRequest

  if external_link:
    try:
      release = Release.bandcamp.get_from_url(external_link)
    except ValueError:
      pass

  slug = slugify(title)
  article = Article.cms.create(
    title=title,
    slug=slug,
    created_by=created_by,
    content=content,
    release=release,
    external_link=external_link,
  )

  return JsonResponse(article_json(article))

def update(request, article_id):
  if request.method == "GET":
    return HttpResponseNotAllowed()
  article = Article.objects.get(pk=article_id)
  if not article:
    return Http404("Not found")
  data = {
    key: request.POST.get(key)
    for key in ("title", "slug", "content")
    if request.POST.get(key)
  }
  author_id = request.POST.get("author_id")
  if author_id:
    try:
      author = User.objects.get(pk=author_id)
    except User.DoesNotExist:
      raise PermissionDenied
    data["author"] = author

  if not data.len() == 0:
    article.update(**data)

  reloaded = Article.objects \
    .prefetch_related("articlecontent_set") \
    .select_related("author") \
    .get(pk=article.id)

  return JsonResponse(article_json(reloaded))
