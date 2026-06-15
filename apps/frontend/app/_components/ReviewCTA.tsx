"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

import type { ReviewRequest } from "@/_types/api";

type ReviewCTAProps = {
  reviewRequests: ReviewRequest[];
};

export const ReviewCTA = ({ reviewRequests }: ReviewCTAProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleClaim = useCallback(
    async (reviewRequest: ReviewRequest) => {
      if (!user) return;
      setIsLoading(true);
      const { ok } = await post<ReviewRequest>({
        endpoint: "music/review-request/claim",
        data: { id: reviewRequest.id },
      });
      if (ok) {
        router.push(`/write-review/${reviewRequest.id}`);
      }
      setIsLoading(false);
    },
    [user, router],
  );

  const buttonDisabled = useMemo(() => !user || isLoading, [user, isLoading]);

  if (!reviewRequests.length) return null;

  return (
    <div className="flex flex-col border-t border-secondary-500 mt-[10px] pt-[10px] gap-[10px]">
      <div>
        <h3>Enjoyed your review?</h3>
        <p>
          Pay it forward by telling us what you think of one of these releases!
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px]">
        {reviewRequests.map((rr, i) => {
          const { release } = rr;
          return (
            <div
              key={rr.id}
              className={classNames("flex flex-col h-full gap-[10px]", {
                "hidden sm:flex": i > 1,
              })}
            >
              <a href={release.links[0].url} target="_blank">
                <div className="flex flex-col p-[5px]">
                  <img
                    src={release.images.md.url}
                    className="border border-background-500 block"
                  />
                  <div className="flex flex-col gap-[5px] text-[14px] pt-[5px]">
                    <p className="text-foreground-500 capitalize">
                      {release.release_type}
                    </p>
                    {release.primary_artist && (
                      <p className="text-secondary-500  overflow-hidden text-ellipsis line-clamp-2">
                        {release.primary_artist.name}
                      </p>
                    )}
                    <p className="font-bold overflow-hidden text-ellipsis line-clamp-2">
                      {release.title}
                    </p>
                  </div>
                </div>
              </a>
              <Button
                label="Claim"
                className="mt-auto"
                disabled={buttonDisabled}
                onClick={() => handleClaim(rr)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
