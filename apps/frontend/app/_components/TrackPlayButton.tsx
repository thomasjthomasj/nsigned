"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PlayIcon } from "@/_components/_icons/PlayIcon";
import { get } from "@/_utils/api.client";

import type { PlayState } from "@/_types";
import type { URL, Track } from "@/_types/api";

type TrackPlayButtonProps = {
  track: Track;
};

export const TrackPlayButton = ({ track }: TrackPlayButtonProps) => {
  const [playState, setPlayState] = useState<PlayState>("paused");
  const [trackURL, setTrackURL] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    if (!trackURL) {
      setPlayState("loading");
      const urlResponse = await get<URL>({
        endpoint: `music/track/${track.id}/mp3-link`,
      });
      if (!urlResponse.ok) {
        setPlayState("paused");
        return;
      }
      setTrackURL(urlResponse.data.url);
    }
    setPlayState("playing");
  }, [track]);

  useEffect(() => {
    // console.log(trackURL)
  }, [trackURL]);

  return (
    <div className="cursor-pointer h-[40px] w-[40px]">
      <PlayIcon state={playState} onClick={handleClick} />
    </div>
  );
};
