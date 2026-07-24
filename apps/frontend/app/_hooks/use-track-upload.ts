import { useCallback, useState } from "react";

import { get, post } from "@/_utils/api.client";
import { uploadFile } from "@/_utils/uploads";

import type { Genre, TrackUploadURL, MP3Status } from "@/_types/api";
import type { UploadStatus } from "@/_types/uploads";

type UploadArgs = {
  file: File;
  title: string;
  genre: Genre;
} & (
  | {
      artistID: number;
    }
  | {
      artistName: string;
    }
);

const MAX_ATTEMPTS = 50;
const MAX_FILESIZE = 250 * 1024 * 1024; // 250MB
const PROGRESS_INTERVAL = 3 * 1000;

export const useTrackUpload = () => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<UploadStatus>("pending");
  const [error, setError] = useState<string | null>(null);
  const [trackID, setTrackID] = useState<number | null>(null);
  const [releaseID, setReleaseID] = useState<number | null>(null);

  const upload = useCallback(async (args: UploadArgs) => {
    setStatus("in_progress");
    setProgress(0);

    const { file, title, genre } = args;

    if (file.type !== "audio/wav") {
      setStatus("invalid");
      setError("Only WAV files are supported");
    }

    if (file.size > MAX_FILESIZE) {
      setStatus("invalid");
      setError("File size must be below 250MB");
    }

    const uploadURLResponse = await post<TrackUploadURL>({
      endpoint: "music/track/start-upload",
      data: {
        track_title: title,
        genre,
        ...("artistID" in args
          ? { artist_id: args.artistID }
          : { artist_name: args.artistName }),
      },
      withAuth: true,
    });

    if (!uploadURLResponse.ok) {
      setStatus("error");
      setError("Could not resolve upload URL");
      return;
    }

    const { upload_url: uploadURL, track_id: newTrackID, release_id: newReleaseID } = uploadURLResponse.data;
    setTrackID(newTrackID);
    setReleaseID(newReleaseID);

    try {
      await uploadFile(file, uploadURL, setProgress);
      setStatus("processing");

      let pollAttempts = 0;
      const interval = setInterval(async () => {
        pollAttempts += 1;
        const statusResponse = await get<MP3Status>({
          endpoint: `music/track/${newTrackID}/mp3-status`,
          withAuth: true,
        });
        if (!statusResponse.ok) {
          setStatus("error");
          setError("Could not get MP3 status");
          clearInterval(interval);
          return;
        }
        const { status } = statusResponse.data;
        if (status === "complete") {
          setStatus("complete");
          setError(null);
          clearInterval(interval);
          return;
        }
        if (pollAttempts >= MAX_ATTEMPTS) {
          setStatus("error");
          setError("Too many attempts at getting MP3 status");
        }
      }, PROGRESS_INTERVAL);
    } catch {
      setStatus("error");
      setError("An error occurred uploading track");
    }
  }, []);

  return {
    upload,
    progress,
    status,
    error,
    trackID,
    releaseID,
  };
};
