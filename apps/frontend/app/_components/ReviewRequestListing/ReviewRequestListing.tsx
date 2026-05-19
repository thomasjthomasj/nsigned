import classNames from "classnames";

import { ReleaseOverview } from "@/_components/ReleaseOverview";

import { ReviewRequestActions } from "./ReviewRequestActions";

import type { ListingType } from "./types";
import type { ReviewRequest } from "@/_types/api";

type ReviewRequestListingProps = {
  reviewRequests: ReviewRequest[];
  includeActions: boolean;
  type: ListingType;
};

export const ReviewRequestListing = ({
  reviewRequests,
  includeActions,
  type,
}: ReviewRequestListingProps) => {
  if (!reviewRequests.length) return null;

  const title = (() => {
    switch (type) {
      case "pending":
        return "Unclaimed";
      case "claimed":
        return "Awaiting your review";
      default:
        return "Pending review requests";
    }
  })();

  const helpText = (() => {
    switch (type) {
      case "pending":
        return "Claiming a release for review attaches you to it and prevents others from reviewing before you.";
      case "claimed":
        return "These are releases that you have already claimed for review.";
      default:
        return "These are your releases that have not yet been reviewed.";
    }
  })();

  return (
    <div className="flex-1">
      <div className="flex flex-col w-full gap-[15px]">
        <div>
          <h3>{title}</h3>
          <p>{helpText}</p>
        </div>
        {reviewRequests.map((r, i) => (
          <div
            className={classNames("grid w-full p-[7px]", {
              "grid-cols-[minmax(0,1fr)_auto] items-start": includeActions,
              "grid-cols-1": !includeActions,
              "bg-background-500": i % 2,
            })}
            key={r.id}
          >
            <ReleaseOverview
              artistName={r.release.primary_artist?.name}
              title={r.release.title}
              imageURL={r.release.images.sm.url}
              releaseType={r.release.release_type}
              link={r.release.links[0].url}
            />
            {includeActions && (
              <div>
                <ReviewRequestActions reviewRequest={r} type={type} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
