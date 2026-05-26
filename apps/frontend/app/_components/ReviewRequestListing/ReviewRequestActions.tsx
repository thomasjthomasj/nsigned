"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

import type { ListingType } from "./types";
import type { ReviewRequest } from "@/_types/api";

type ReviewRequestActionsProps = {
  reviewRequest: ReviewRequest;
  type: ListingType;
};

export const ReviewRequestActions = ({
  reviewRequest,
  type,
}: ReviewRequestActionsProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user && user.role === "admin", [user]);

  const handleClaim = useCallback(async () => {
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
  }, [reviewRequest, user, router]);

  const handleUnclaim = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { ok } = await post<ReviewRequest>({
      endpoint: "music/review-request/unclaim",
      data: { id: reviewRequest.id },
    });
    if (ok) {
      window.location.reload();
    }
  }, [reviewRequest, user]);

  const handleReject = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { ok } = await post<ReviewRequest>({
      endpoint: "music/review-request/reject",
      data: { id: reviewRequest.id },
    });
    if (ok) {
      router.refresh();
    }
    setIsLoading(false);
  }, [reviewRequest, user, router]);

  const disableButton = useMemo(() => !user || isLoading, [user, isLoading]);

  return (
    <div className="flex flex-col gap-[5px]">
      {type === "pending" && (
        <Button disabled={disableButton} onClick={handleClaim} label="Claim" />
      )}
      {type === "claimed" && (
        <>
          <a
            href={`/write-review/${reviewRequest.id}`}
            className="w-full block"
          >
            <Button label="Review" className="w-full" />
          </a>
          <Button
            label="Unclaim"
            onClick={handleUnclaim}
            disabled={disableButton}
          />
        </>
      )}
      {type === "mine" && reviewRequest.claimed_by && (
        <Button
          label="Unassign reviewer"
          onClick={handleUnclaim}
          disabled={disableButton}
        />
      )}
      {isAdmin && (
        <Button
          disabled={disableButton}
          onClick={handleReject}
          label="Reject"
        />
      )}
    </div>
  );
};
