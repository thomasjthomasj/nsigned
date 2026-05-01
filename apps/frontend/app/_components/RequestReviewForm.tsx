"use client"

import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react"
import { FormField } from "@/_components/FormField";
import { ReleaseOverview } from "@/_components/ReleaseOverview";
import { useDebounce } from "@/_hooks";
import { get, post } from "@/_utils/api.client";

import type { ReleaseDetails, ReviewRequest } from "@/_types/api";

const BANDCAMP_REGEX = /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/(album|track)\/[a-z0-9-]+/

export const RequestReviewForm = () => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRetrieving, setIsRetrieving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [releaseDetails, setReleaseDetails] = useState<ReleaseDetails | null>(null);

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
    setIsRetrieving(false)
  }, [url]);

  const debouncedReleaseDetails = useDebounce(getReleaseDetails)

  useEffect(() => {
    if (BANDCAMP_REGEX.test(url)) {
      debouncedReleaseDetails();
    }
  }, [url]);

  const handleSubmit = useCallback(async () => {
    if (!url || isRetrieving || isSubmitting) return;
    setIsSubmitting(true);
    const { data, ok } = await post<ReviewRequest>({
      endpoint: "music/request-review",
      withAuth: true,
      data: { url },
    })
  }, [url, isRetrieving, isSubmitting])

  const buttonDisabled = useMemo(() => {
    return isRetrieving || isSubmitting || !releaseDetails
  }, [isRetrieving, isSubmitting, releaseDetails]);

  return (
    <div className="flex flex-col gap-[10px]">
      {error && <p className="text-red">{error}</p>}
      <FormField
        label="Bandcamp URL"
        name="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {isRetrieving && <p>Loading...</p>}
      {releaseDetails && <ReleaseOverview
        artistName={releaseDetails.artist_name}
        title={releaseDetails.title}
        label={releaseDetails.label ?? undefined}
        imageURL={releaseDetails.images.sm.url}
        releaseType={releaseDetails.release_type}
        link={releaseDetails.link}
      />}
      <button
        className={classNames(
          "p-[5px] border border-1 border-[#eee]",
          {
            "cursor-pointer": !buttonDisabled,
            "bg-[#eee] text-[#aaa] cursor-not-allowed": buttonDisabled,
          }
        )}
        onClick={handleSubmit}
        disabled={buttonDisabled}
      >
        Submit
      </button>
    </div>
  )
}
