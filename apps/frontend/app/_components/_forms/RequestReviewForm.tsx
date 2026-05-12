"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { ReleaseOverview } from "@/_components/ReleaseOverview";
import { useAuth, useDebounce } from "@/_hooks";
import { get, post } from "@/_utils/api.client";

import type { ReleaseDetails, ReviewRequest } from "@/_types/api";

const BANDCAMP_REGEX =
  /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/(album|track)\/[a-z0-9-]+/;

type RequestReviewFormProps = {
  existingReviewRequests: ReviewRequest[] | null;
};

export const RequestReviewForm = ({
  existingReviewRequests,
}: RequestReviewFormProps) => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRetrieving, setIsRetrieving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [releaseDetails, setReleaseDetails] = useState<ReleaseDetails | null>(
    null,
  );
  const router = useRouter();
  const { user } = useAuth();

  const getReleaseDetails = useCallback(async () => {
    setIsRetrieving(true);
    const response = await get<ReleaseDetails>({
      endpoint: "music/release-details",
      withAuth: true,
      data: { url },
    });
    if (!response.ok) {
      setError(response.data.error);
    } else {
      setReleaseDetails(response.data);
    }
    setIsRetrieving(false);
  }, [url]);

  const debouncedReleaseDetails = useDebounce(getReleaseDetails);

  useEffect(() => {
    if (BANDCAMP_REGEX.test(url)) {
      debouncedReleaseDetails();
    } else {
      setReleaseDetails(null);
    }
  }, [url]);

  const handleSubmit = useCallback(async () => {
    if (!url || isRetrieving || isSubmitting) return;
    setIsSubmitting(true);
    const { data, ok } = await post<ReviewRequest>({
      endpoint: "music/request-review",
      withAuth: true,
      data: { url },
    });
    if (!ok) {
      setError(data.error);
    } else {
      setUrl("");
      router.refresh();
    }
    setIsSubmitting(false);
  }, [router, url, isRetrieving, isSubmitting]);

  const buttonDisabled = useMemo(() => {
    return isRetrieving || isSubmitting || !releaseDetails;
  }, [isRetrieving, isSubmitting, releaseDetails]);

  const canRequestReview = useMemo(() => {
    if (!user) return false;
    if (!existingReviewRequests?.length) return true;
    return user.role === "admin";
  }, [user, existingReviewRequests]);

  if (!user) return null;
  if (!canRequestReview)
    return (
      <p>
        You cannot currently request any more reviews. Please wait until your
        existing request
        {(existingReviewRequests ?? []).length === 1 ? " has" : "s have"} been
        reviewed.
      </p>
    );

  return (
    <div className="flex flex-col gap-[15px] my-[25px]">
      {error && <p className="text-red">{error}</p>}
      <FormField
        label="Bandcamp URL"
        name="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {releaseDetails && (
        <div className="flex w-full">
          <ReleaseOverview
            artistName={releaseDetails.artist_name}
            title={releaseDetails.title}
            label={releaseDetails.label ?? undefined}
            imageURL={releaseDetails.images.sm.url}
            releaseType={releaseDetails.release_type}
            link={releaseDetails.link}
          />
          <div>
            <Button
              label="Submit for review"
              onClick={handleSubmit}
              disabled={buttonDisabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};
