import { Error } from "@/_components/Error";
import { MyReviewsListing } from "@/_components/MyReviewsListing";
import { PageLayout } from "@/_components/PageLayout";
import { get, getMe } from "@/_utils/api.server";

import type { Article } from "@/_types/api";

const MyReviews = async () => {
  const userResponse = await getMe();
  if (!userResponse.ok) return <Error />;
  const { data: user } = userResponse;

  const [artistResponse, authorResponse] = await Promise.all([
    get<Article[]>({
      endpoint: "articles",
      data: {
        artist_user: user.username,
      },
    }),
    get<Article[]>({
      endpoint: "articles",
      data: {
        author: user.username,
      },
    }),
  ]);

  if (!artistResponse.ok || !authorResponse.ok) return <Error />;

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
