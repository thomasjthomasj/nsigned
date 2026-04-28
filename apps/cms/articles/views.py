import json
from slugify import slugify
from django.http import HttpResponse, JsonResponse, HttpResponseNotAllowed, Http404
from django.core.exceptions import BadRequest, PermissionDenied
from app.decorators import logged_in, method
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
    .get(pk=article.id)
  if not article:
    return Http404("Not found")

  return JsonResponse(article_json(article))

@method("POST")
@logged_in(role="contributor")
def create(request):
  data = json.loads(request.body)

  try:
    created_by = request.user
  except User.DoesNotExist:
    raise PermissionDenied

  content = data.get("content")
  title = data.get("title")
  external_link = data.get("external_link")
  release = None
  if not content or not title:
    raise BadRequest

  if external_link:
    try:
      release = Release.bandcamp.get_from_url(external_link)
    except ValueError as e:
      raise e

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

@method("POST")
@logged_in(role="editor")
def update(request, article_id):
  article = Article.objects.get(pk=article_id)
  if not article:
    return Http404("Not found")
  data = {
    key: request.POST.get(key)
    for key in ("title", "slug", "content")
    if request.POST.get(key)
  }
  created_by_id = request.POST.get("created_by_id")
  if created_by_id:
    try:
      created_by = User.objects.get(pk=created_by_id)
    except User.DoesNotExist:
      raise PermissionDenied
    data["created_by"] = created_by

  if not data.len() == 0:
    article.update(**data)

  reloaded = Article.objects \
    .prefetch_related("contents") \
    .select_related("created_by") \
    .get(pk=article.id)

  return JsonResponse(article_json(reloaded))
