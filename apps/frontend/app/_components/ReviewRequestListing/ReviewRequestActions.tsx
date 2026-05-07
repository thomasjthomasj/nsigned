"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

import type { ReviewRequest } from "@/_types/api";

type ReviewRequestActionsProps = {
  reviewRequest: ReviewRequest;
};

export const ReviewRequestActions = ({
  reviewRequest,
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
      <Button disabled={disableButton} onClick={handleClaim} label="Claim" />
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
