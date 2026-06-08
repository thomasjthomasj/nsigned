import { BlogListing } from "@/_components/BlogListing";
import { PageLayout } from "@/_components/PageLayout";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Article } from "@/_types/api";

const Blog = async () => {
  const cacheKey = getCacheKey({
    key: CACHE_KEY.ARTICLES,
    getData: { type: "blog" },
  });
  const blogResponse = await get<Article[]>({
    endpoint: "articles",
    data: {
      type: "blog",
    },
    cacheKey,
  });

  if (!blogResponse.ok) {
    return handleError({
      errorResponse: blogResponse,
      message: "Could not load blog",
    });
  }

  const { data: articles } = blogResponse;

  return (
    <PageLayout title="Blog">
      <BlogListing articles={articles} showAuthor />
    </PageLayout>
  );
};

export default Blog;
