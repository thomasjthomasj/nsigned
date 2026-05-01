"use client"

import { useCallback, useEffect, useState } from "react"
import { FormField } from "@/_components/FormField";
import { ReleaseOverview } from "@/_components/ReleaseOverview";
import { useDebounce } from "@/_hooks";
import { get } from "@/_utils/api.client";

import type { ReleaseDetails } from "@/_types/api";

const BANDCAMP_REGEX = /^https:\/\/[a-zA-Z0-9-]+\.bandcamp\.com\/(album|track)\/[a-z0-9-]+/

export const RequestReviewForm = () => {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [retrieving, setRetrieving] = useState<boolean>(false);
  const [releaseDetails, setReleaseDetails] = useState<ReleaseDetails | null>(null);

  const getReleaseDetails = useCallback(async () => {
    setRetrieving(true);
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
    setRetrieving(false)
  }, [url]);

  const debouncedReleaseDetails = useDebounce(getReleaseDetails)

  useEffect(() => {
    if (BANDCAMP_REGEX.test(url)) {
      debouncedReleaseDetails();
    }
  }, [url]);

  return (
    <div className="flex flex-col gap-[10px]">
      {error && <p className="text-red">{error}</p>}
      <FormField
        label="Bandcamp URL"
        name="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {retrieving && <p>Loading...</p>}
      {releaseDetails && <ReleaseOverview
        artistName={releaseDetails.artist_name}
        title={releaseDetails.title}
        label={releaseDetails.label}
        imageURL={releaseDetails.image_url}
        releaseType={releaseDetails.release_type}
        link={releaseDetails.link}
      />}
    </div>
  )
}
