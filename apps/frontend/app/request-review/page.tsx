import { useMemo } from "react";

import { Error } from "@/_components/Error";
import { ReleaseOverview } from "@/_components/ReleaseOverview";
import { RequestReviewForm } from "@/_components/_forms/RequestReviewForm";
import { useAuth } from "@/_hooks/use-auth";
import { get } from "@/_utils/api.server";

import type { ReviewRequest } from "@/_types/api";

const RequestReview = async () => {
  const { ok, data } = await get<ReviewRequest[]>({
    endpoint: "music/review-request/current",
  });

  if (!ok) return <Error />;

  const reviewRequests = data;

  return (
    <div>
      {reviewRequests.length && (
        <div className="flex flex-col">
          <p>Your pending review requests:</p>
          {reviewRequests.map((r) => (
            <ReleaseOverview
              key={r.id}
              artistName={r.release.primary_artist.name}
              title={r.release.title}
              imageURL={r.release.images.sm.url}
              releaseType={r.release.release_type}
              link={r.release.links[0].url}
            />
          ))}
        </div>
      )}
      <RequestReviewForm existingReviewRequests={reviewRequests} />
    </div>
  );
};

export default RequestReview;
