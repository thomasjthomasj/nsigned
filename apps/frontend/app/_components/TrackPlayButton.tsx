"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PlayIcon } from "@/_components/_icons/PlayIcon";
import { usePlayer } from "@/_hooks";
import { get } from "@/_utils/api.client";

import type { PlayState } from "@/_types";
import type { URL, Track } from "@/_types/api";

type TrackPlayButtonProps = {
  track: Track;
};

export const TrackPlayButton = ({ track }: TrackPlayButtonProps) => {
  const [playState, setPlayState] = useState<PlayState>("paused");
  const { playTrack } = usePlayer();

  return (
    <div className="cursor-pointer h-[40px] w-[40px]">
      <PlayIcon state={playState} onClick={() => playTrack(track)} />
    </div>
  );
};
