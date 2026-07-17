"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PlayIcon } from "@/_components/_icons/PlayIcon";
import { XIcon } from "@/_components/_icons/XIcon";
import { usePlayer } from "@/_hooks";

export const Player = () => {
  const [perc, setPerc] = useState<number>(0);
  const { track, playState, setPlayState, open, closePlayer, trackURL } =
    usePlayer();

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

  const handleTimeUpdate = useCallback(() => {
    const audio = trackRef.current;
    if (!audio) {
      setPerc(0);
      return;
    }
    const { currentTime, duration } = audio;
    setPerc((currentTime / duration) * 100);
  }, []);

  const handleClose = useCallback(() => {
    setPerc(0);
    closePlayer();
  }, [closePlayer]);

  if (!open) return null;

  return (
    <>
      <div className="fixed bottom-0 bg-background-500 border-t border-tertiary-500 p-3 flex items-center w-full">
        <div className="absolute top-[8px] right-[8px] cursor-pointer">
          <XIcon className="h-[10px] w-[10px]" onClick={handleClose} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full p-[10px]">
            <div
              className="h-[10px] bg-primary-500"
              style={{ width: `${perc}%` }}
            />
            <div className="w-full border-b border-primary-500 h-0" />
          </div>
          <div className="flex justify-between">
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
      </div>
      {trackURL && (
        <audio ref={trackRef} src={trackURL} onTimeUpdate={handleTimeUpdate} />
      )}
    </>
  );
};
