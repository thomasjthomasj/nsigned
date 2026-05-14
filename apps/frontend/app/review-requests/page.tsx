import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ReviewRequestListing } from "@/_components/ReviewRequestListing";
import { get, getMe } from "@/_utils/api.server";

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
    }),
    get<ReviewRequest[]>({
      endpoint: "music/review-request/claimed",
    }),
  ]);

  if (!userResponse.ok)
    return <Error errorResponse={userResponse.data} requireLoggedIn />;
  if (!pendingReviewRequestsResponse.ok)
    return (
      <Error
        errorResponse={pendingReviewRequestsResponse.data}
        requireLoggedIn
      />
    );
  if (!claimedReviewRequestsResponse.ok)
    return (
      <Error
        errorResponse={claimedReviewRequestsResponse.data}
        requireLoggedIn
      />
    );

  const user = userResponse.data;
  const { data: claimedReviewRequests } = claimedReviewRequestsResponse;
  const pendingReviewRequests = pendingReviewRequestsResponse.data.filter(
    (r) =>
      user.role === "admin" ||
      ![r.created_by.id, r.release.primary_artist?.user?.id].includes(user.id),
  );

  return (
    <PageLayout title="Review requests">
      <div className="flex flex-col gap-[20px]">
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
