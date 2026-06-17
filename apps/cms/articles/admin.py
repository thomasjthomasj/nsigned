from django.contrib import admin

from .models import Article, ArticleContent, Bookmark

class ArticleContentInline(admin.StackedInline):
  model = ArticleContent
  extra = 0

class ArticleAdmin(admin.ModelAdmin):
  inlines = [
    ArticleContentInline,
  ]

class BookmarkAdmin(admin.ModelAdmin):
  model = Bookmark

admin.site.register(Article, ArticleAdmin)
admin.site.register(Bookmark, BookmarkAdmin)
