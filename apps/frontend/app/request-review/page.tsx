import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { ReviewRequestListing } from "@/_components/ReviewRequestListing";
import { RequestReviewForm } from "@/_components/_forms/RequestReviewForm";
import { get } from "@/_utils/api.server";

import type { ReviewRequest } from "@/_types/api";

const RequestReview = async () => {
  const { ok, data: reviewRequests } = await get<ReviewRequest[]>({
    endpoint: "music/review-request/current",
  });

  if (!ok) return <Error />;

  return (
    <PageLayout title="My review requests">
      <ReviewRequestListing
        reviewRequests={reviewRequests}
        includeActions={false}
      />
      <RequestReviewForm existingReviewRequests={reviewRequests} />
    </PageLayout>
  );
};

export default RequestReview;
