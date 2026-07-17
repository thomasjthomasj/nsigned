"use client";

import { useCallback, useEffect, useRef } from "react";

import { PlayIcon } from "@/_components/_icons/PlayIcon";
import { usePlayer } from "@/_hooks";

export const Player = () => {
  const { track, playState, setPlayState, open, error, trackURL } = usePlayer();

  const trackRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = trackRef.current;
    if (!audio) return;
    audio.volume = 1;
    if (playState === "playing") {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playState]);

  const handleButtonClick = useCallback(() => {
    if (playState === "paused") return setPlayState("playing");
    return setPlayState("paused");
  }, [playState]);

  if (!open) return null;

  return (
    <>
      <div className="fixed bottom-0 bg-background-500 border border-tertiary-500 p-3 flex items-center w-full">
        <div className="flex justify-between w-[80%]">
          <div className="flex flex-col gap-[5px]">
            {track && (
              <>
                <p className="font-bold">
                  {track.release.primary_artist?.name ?? "Unknown artist"}
                </p>
                <p>{track.title}</p>
              </>
            )}
          </div>
          <PlayIcon state={playState} onClick={handleButtonClick} />
        </div>
      </div>
      {trackURL && <audio ref={trackRef} src={trackURL} />}
    </>
  );
};
