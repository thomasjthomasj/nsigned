import { BlogArticleLink } from "@/_components/BlogArticleLink";
import { PageLayout } from "@/_components/PageLayout";
import { ReleaseArticleLink } from "@/_components/ReleaseArticleLink";
import { handleError } from "@/_fns/handle-error";
import { get, getMe } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Article } from "@/_types/api";

const Bookmarks = async () => {
  const userResponse = await getMe();
  if (!userResponse.ok) return handleError({ errorResponse: userResponse });
  const bookmarksResponse = await get<Article[]>({
    endpoint: "articles/bookmarks",
    withAuth: true,
    // cacheKey: getCacheKey({
    //   key: CACHE_KEY.BOOKMARKS,
    //   idVal: userResponse.data.id,
    // })
  });
  if (!bookmarksResponse.ok)
    return handleError({ errorResponse: bookmarksResponse });

  const { data: articles } = bookmarksResponse;

  return (
    <PageLayout title="Bookmarks">
      <div className="w-full flex flex-col gap-[20px]">
        {!articles.length && <p>You have not bookmarked any articles.</p>}
        {!!articles.length &&
          articles.map((a) =>
            a.release ? (
              <ReleaseArticleLink
                key={a.id}
                article={a}
                size="lg"
                showReviewType
              />
            ) : (
              <BlogArticleLink key={a.id} article={a} showAuthor />
            ),
          )}
      </div>
    </PageLayout>
  );
};

export default Bookmarks;
