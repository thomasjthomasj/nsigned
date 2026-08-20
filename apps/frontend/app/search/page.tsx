"use server";

import { PageLayout } from "@/_components/PageLayout";
import { Searcher } from "@/_components/Searcher";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Article } from "@/_types/api";

type SearchProps = {
  searchParams: Promise<{
    term?: string;
  }>;
};

const Search = async ({ searchParams }: SearchProps) => {
  const { term } = await searchParams;
  const articlesResponse = await get<Article[]>({
    endpoint: "articles/search",
    data: { term },
    cacheKey: getCacheKey({
      key: CACHE_KEY.ARTICLES_SEARCH,
      getData: { term },
    }),
  });

  if (!articlesResponse.ok)
    return handleError({ errorResponse: articlesResponse });

  const { data: articles } = articlesResponse;

  return (
    <PageLayout title="Search">
      <div className="w-full">
        <Searcher articles={articles} term={term ?? ""} />
      </div>
    </PageLayout>
  );
};

export default Search;
