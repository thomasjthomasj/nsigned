import { PageLayout } from "@/_components/PageLayout";
import { ReviewRequestListing } from "@/_components/ReviewRequestListing";
import { handleError } from "@/_fns/handle-error";
import { get, getMe } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { ReviewRequest } from "@/_types/api";

const ReviewRequests = async () => {
  const [
    userResponse,
    pendingReviewRequestsResponse,
    claimedReviewRequestsResponse,
  ] = await Promise.all([
    getMe(),
    get<ReviewRequest[]>({
      endpoint: "music/review-request/pending",
      cacheKey: getCacheKey({
        key: CACHE_KEY.REVIEW_REQUESTS,
      }),
    }),
    get<ReviewRequest[]>({
      endpoint: "music/review-request/claimed",
    }),
  ]);

  if (!userResponse.ok && userResponse.status !== 401)
    return handleError({ errorResponse: userResponse });
  const user = userResponse.ok ? userResponse.data : null;

  if (!pendingReviewRequestsResponse.ok)
    return handleError({ errorResponse: pendingReviewRequestsResponse });

  const claimedReviewRequests = claimedReviewRequestsResponse.ok
    ? claimedReviewRequestsResponse.data
    : [];
  const pendingReviewRequests = pendingReviewRequestsResponse.data.filter(
    (r) =>
      !user ||
      user.role === "admin" ||
      ![r.created_by.id, r.release.primary_artist?.user?.id].includes(user.id),
  );

  return (
    <PageLayout title="Review requests">
      <div className="flex flex-col gap-[20px]">
        {!user && (
          <div>
            <p>
              You must be{" "}
              <a href="/join?redirect=/review-requests">registered</a> and{" "}
              <a href="/login?redirect=/review-requests">logged in</a> to write
              a review.
            </p>
          </div>
        )}
        <ReviewRequestListing
          reviewRequests={claimedReviewRequests}
          includeActions={true}
          type="claimed"
        />
        <ReviewRequestListing
          reviewRequests={pendingReviewRequests}
          includeActions={true}
          type="pending"
        />
      </div>
    </PageLayout>
  );
};

export default ReviewRequests;
