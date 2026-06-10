"use client";

import { useCallback, useEffect, useState } from "react";

import { ReviewRequestListing } from "@/_components/ReviewRequestListing";
import { useAuth } from "@/_hooks";
import { get } from "@/_utils/api.client";

import type { ReviewRequest } from "@/_types/api";

export const ReviewRequestConfirmation = () => {
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[] | null>(
    null,
  );
  const { user } = useAuth();

  const loadReviewRequests = useCallback(async () => {
    if (!user) return;
    const response = await get<ReviewRequest[]>({
      endpoint: "music/review-request/pending",
    });
    if (!response.ok) return;
    setReviewRequests(
      response.data
        .filter((r) => r.created_by.id !== user.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4),
    );
  }, [user]);

  useEffect(() => {
    loadReviewRequests();
  }, [loadReviewRequests]);

  if (!user) return null;

  return (
    <div className="flex flex-col">
      <p className="font-bold">Thank you for your submission!</p>
      {!!reviewRequests?.length && (
        <>
          <p>Why not review something while you wait?</p>
          <ReviewRequestListing
            reviewRequests={reviewRequests}
            includeActions={true}
          />
        </>
      )}
    </div>
  );
};
