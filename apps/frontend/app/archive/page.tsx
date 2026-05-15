import { PageLayout } from "@/_components/PageLayout";
import { ReviewArchive } from "@/_components/ReviewArchive";
import { get } from "@/_utils/api.server";
import { handleError } from "@/_utils/errors.server";

import type { Article } from "@/_types/api";

type ReviewsProps = {
  searchParams: Promise<{
    artist?: string;
    type?: "track" | "album";
    author?: string;
    artistUser?: string;
  }>;
};

const Reviews = async ({ searchParams }: ReviewsProps) => {
  const { artist, type = "review", author, artistUser } = await searchParams;
  const reviewsResponse = await get<Article[]>({
    endpoint: "articles",
    data: {
      artist,
      type,
      author,
      artist_user: artistUser,
    },
  });

  if (!reviewsResponse.ok)
    return handleError({
      errorResponse: reviewsResponse,
      message: "Could not load reviews",
    });

  const { data: articles } = reviewsResponse;

  return (
    <PageLayout title="Archive">
      <div className="w-full">
        <ReviewArchive
          articles={articles}
          queryParams={{
            artist,
            type,
            author,
            artistUser,
          }}
        />
      </div>
    </PageLayout>
  );
};

export default Reviews;
