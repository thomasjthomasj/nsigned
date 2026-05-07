import { Error } from "@/_components/Error";
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
    <div className="w-full flex-1">
      <h2>Review requests</h2>
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
    </div>
  );
};

export default ReviewRequests;
