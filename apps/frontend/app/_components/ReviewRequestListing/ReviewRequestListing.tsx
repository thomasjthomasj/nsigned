import classNames from "classnames";

import { ReleaseOverview } from "@/_components/ReleaseOverview";

import { ReviewRequestActions } from "./ReviewRequestActions";

import type { ReviewRequest } from "@/_types/api";

type ReviewRequestListingProps = {
  reviewRequests: ReviewRequest[];
  includeActions: boolean;
};

export const ReviewRequestListing = ({
  reviewRequests,
  includeActions,
}: ReviewRequestListingProps) => (
  <div className="flex-1">
    <div className="flex flex-col w-full gap-[15px]">
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
              <ReviewRequestActions reviewRequest={r} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
