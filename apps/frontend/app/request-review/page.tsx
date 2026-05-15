import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ReviewRequestListing } from "@/_components/ReviewRequestListing";
import { RequestReviewForm } from "@/_components/_forms/RequestReviewForm";
import { get } from "@/_utils/api.server";

import type { ReviewRequest } from "@/_types/api";

const RequestReview = async () => {
  const reviewRequestsResponse = await get<ReviewRequest[]>({
    endpoint: "music/review-request/current",
  });

  if (!reviewRequestsResponse.ok) return <Error requireLoggedIn />;

  const { data: reviewRequests } = reviewRequestsResponse;

  return (
    <PageLayout title="Request review">
      <div className="flex flex-col gap-[15px]">
        <RequestReviewForm existingReviewRequests={reviewRequests} />
        <ReviewRequestListing
          reviewRequests={reviewRequests}
          includeActions={false}
          type="mine"
        />
      </div>
    </PageLayout>
  );
};

export default RequestReview;
