def article_json(article):
  content = next(
    content for content in article.contents.all() \
      if content.active
  )

  return {
    "article": {
      "id": article.id,
      "title": article.title,
      "slug": article.slug,
      "external_link": article.external_link.url,
      "created_by": {
        "id": article.created_by.id,
        "username": article.created_by.username,
        "display_name": article.created_by.display_name,
      } if article.created_by else None,
      "content": {
        "id": content.id,
        "content": content.content
      } if content else None,
    }
  }
