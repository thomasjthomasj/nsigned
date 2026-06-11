import { PageLayout } from "@/_components/PageLayout";
import { ReviewArchive } from "@/_components/ReviewArchive";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";
import { genres } from "@/_utils/genre";

import type { Article, Genre } from "@/_types/api";

type ReviewsProps = {
  searchParams: Promise<{
    artist?: string;
    type?: "track" | "album";
    author?: string;
    artistUser?: string;
    genre?: Genre;
  }>;
};

const Reviews = async ({ searchParams }: ReviewsProps) => {
  const {
    artist,
    type = "review",
    author,
    artistUser,
    genre,
  } = await searchParams;
  const cacheKey = getCacheKey({
    key: CACHE_KEY.ARTICLES,
    getData: { artist, type, author, artist_user: artistUser, genre },
  });
  const reviewsResponse = await get<Article[]>({
    endpoint: "articles",
    data: {
      artist,
      type,
      author,
      artist_user: artistUser,
      genre,
    },
    cacheKey,
  });

  if (!reviewsResponse.ok)
    return handleError({
      errorResponse: reviewsResponse,
      message: "Could not load reviews",
    });

  const { data: articles } = reviewsResponse;

  return (
    <PageLayout title={genre ? genres[genre] : "Archive"}>
      <div className="w-full">
        <ReviewArchive
          articles={articles}
          queryParams={{
            artist,
            type,
            author,
            artistUser,
            genre,
          }}
        />
      </div>
    </PageLayout>
  );
};

export default Reviews;
