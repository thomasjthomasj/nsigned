from django.contrib import admin

from .models import Article, ArticleContent

class ArticleContentInline(admin.StackedInline):
  model = ArticleContent
  extra = 0

class ArticleAdmin(admin.ModelAdmin):
  inlines = [
    ArticleContentInline,
  ]

admin.site.register(Article, ArticleAdmin)
