def article_json(article):
  content = next(
    content for content in article.articlecontent_set.all() \
      if content.active
  )

  return {
    "article": {
      "id": article.id,
      "title": article.title,
      "slug": article.slug,
      "external_link": article.external_link,
      "author": {
        "id": article.author.id,
        "username": article.author.username,
        "display_name": article.author.display_name,
      } if article.author else None,
      "content": {
        "id": content.id,
        "content": content.content
      } if content else None,
    }
  }
