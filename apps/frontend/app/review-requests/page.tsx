import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ReviewRequestListing } from "@/_components/ReviewRequestListing";
import { get, getMe } from "@/_utils/api.server";

import type { ReviewRequest } from "@/_types/api";

const ReviewRequests = async () => {
  const [userResponse, reviewRequestsResponse] = await Promise.all([
    getMe(),
    get<ReviewRequest[]>({
      endpoint: "music/review-request/pending",
    }),
  ]);

  if (!userResponse.ok || !reviewRequestsResponse.ok) return <Error />;

  const user = userResponse.data;
  const reviewRequests = reviewRequestsResponse.data.filter(
    (r) =>
      user.role === "admin" ||
      ![r.created_by.id, r.release.primary_artist?.user?.id].includes(user.id),
  );

  return (
    <PageLayout title="Review requests">
      {reviewRequests.length ? (
        <>
          <p>The following releases are waiting for a review</p>
          <ReviewRequestListing
            reviewRequests={reviewRequests}
            includeActions={true}
          />
        </>
      ) : (
        <p>There are no pending review requests.</p>
      )}
    </PageLayout>
  );
};

export default ReviewRequests;
