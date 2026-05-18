import { MyReviewsListing } from "@/_components/MyReviewsListing";
import { PageLayout } from "@/_components/PageLayout";
import { handleError } from "@/_fns/handle-error";
import { get, getMe } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Article } from "@/_types/api";

const MyReviews = async () => {
  const userResponse = await getMe();
  if (!userResponse.ok) return handleError({ errorResponse: userResponse });
  const { data: user } = userResponse;

  const [artistResponse, authorResponse] = await Promise.all([
    get<Article[]>({
      endpoint: "articles",
      data: {
        artist_user: user.username,
      },
      cacheKey: getCacheKey({
        key: CACHE_KEY.ARTICLES,
        getData: { artist_user: user.username },
      }),
    }),
    get<Article[]>({
      endpoint: "articles",
      data: {
        author: user.username,
      },
      cacheKey: getCacheKey({
        key: CACHE_KEY.ARTICLES,
        getData: { author: user.username },
      }),
    }),
  ]);

  if (!artistResponse.ok) return handleError({ errorResponse: artistResponse });
  if (!authorResponse.ok) return handleError({ errorResponse: authorResponse });

  return (
    <PageLayout title="Your articles">
      <MyReviewsListing
        user={user}
        artistArticles={artistResponse.data}
        authorArticles={authorResponse.data}
      />
    </PageLayout>
  );
};

export default MyReviews;
