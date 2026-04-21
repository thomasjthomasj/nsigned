from slugify import slugify
from django.db import transaction
from django.http import HttpResponse, JsonResponse
from django.core.exceptions import BadRequest, PermissionDenied
from django.shortcuts import render
from users.models import User
from .models import Article
from .utils import article_json

def index(request):
  return HttpResponse("This is the articles index.")

def article(request, article_id):
  article = Article.objects \
    .prefetch_related("articlecontent_set") \
    .select_related("author") \
    .get(pk=article_id)

  return JsonResponse(article_json(article))

@transaction.atomic
def create(request):
  if request.method == "GET":
    return render(
      request,
      "create.html",
    )
  # TODO proper user system
  author_id = request.POST.get("author_id")
  author = User.objects.get(pk=author_id)
  if not author:
    raise PermissionDenied
  content = request.POST.get("content")
  title = request.POST.get("title")
  if not content or not title:
    raise BadRequest
  slug = slugify(title)
  article = Article.objects.create(
    title=title,
    slug=slug,
    author=author,
    content=content
  )

  reloaded = Article.objects \
    .prefetch_related("articlecontent_set") \
    .select_related("author") \
    .get(pk=article.id)

  return JsonResponse(article_json(reloaded))
