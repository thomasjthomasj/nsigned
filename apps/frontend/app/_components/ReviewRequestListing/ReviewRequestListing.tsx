import classNames from "classnames";

import { ReleaseOverview } from "@/_components/ReleaseOverview";
import { getDaysSince } from "@/_utils/date";

import { ReviewRequestActions } from "./ReviewRequestActions";

import type { ListingType } from "./types";
import type { ReviewRequest } from "@/_types/api";

type ReviewRequestListingProps = {
  reviewRequests: ReviewRequest[];
  includeActions: boolean;
  type?: ListingType;
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
      case "mine":
        return "Pending review requests";
      default:
        return null;
    }
  })();

  const helpText = (() => {
    switch (type) {
      case "pending":
        return [
          <p key={0}>
            Claiming a release for review attaches you to it and prevents others
            from reviewing before you.
          </p>,
          <p key={1}>
            You can pick whichever release you want, but please try to
            prioritise releases that have been waiting a long time.
          </p>,
        ];
      case "claimed":
        return (
          <p>These are releases that you have already claimed for review.</p>
        );
      case "mine":
        return <p>These are your releases that have not yet been reviewed.</p>;
      default:
        return null;
    }
  })();

  return (
    <div className="flex-1">
      <div className="flex flex-col w-full gap-[15px]">
        {type !== null && (
          <div>
            <h3>{title}</h3>
            <div className="space-y-[7px]">{helpText}</div>
          </div>
        )}
        <div className="flex flex-col gap-[25px]">
          {reviewRequests.map((r, i) => (
            <div key={r.id} className="flex flex-col">
              <div
                className={classNames("grid w-full p-[7px]", {
                  "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-start":
                    includeActions,
                  "bg-background-500": i % 2,
                })}
              >
                <ReleaseOverview
                  artistName={r.release.primary_artist?.name}
                  title={r.release.title}
                  images={r.release.images}
                  genre={r.release.genre}
                  releaseType={r.release.release_type}
                  link={r.release.links[0].url}
                  daysSince={getDaysSince(r.created_at)}
                  claimed={!!(type === "mine" && r.claimed_by)}
                />
                {includeActions && (
                  <div className="hidden sm:block">
                    <ReviewRequestActions
                      reviewRequest={r}
                      type={type ?? "pending"}
                    />
                  </div>
                )}
              </div>
              {includeActions && (
                <div
                  className={classNames("block sm:hidden px-[7px] pb-[7px]", {
                    "bg-background-500": i % 2,
                  })}
                >
                  <ReviewRequestActions
                    reviewRequest={r}
                    type={type ?? "pending"}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
