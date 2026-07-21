"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PlayerTime } from "@/_components/PlayerTime";
import { TimelineSlider } from "@/_components/TimelineSlider";
import { PlayIcon } from "@/_components/_icons/PlayIcon";
import { XIcon } from "@/_components/_icons/XIcon";
import { usePlayer } from "@/_hooks";

export const Player = () => {
  const [perc, setPerc] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const { track, playState, setPlayState, open, closePlayer, trackURL } =
    usePlayer();

  const trackRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = trackRef.current;
    if (!audio) return;
    setDuration(audio.duration);
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
    setCurrentTime(currentTime);
    setDuration(duration);
  }, []);

  const handleClose = useCallback(() => {
    setPerc(0);
    closePlayer();
  }, [closePlayer]);

  const handleTimelineChange = useCallback((percent: number) => {
    const audio = trackRef.current;
    if (!audio?.duration) return;
    audio.currentTime = (percent / 100) * audio.duration;
  }, []);

  useEffect(() => {
    const audio = trackRef.current;
    if (!audio) return;
    if (isDragging) {
      audio.volume = 0;
    } else {
      audio.volume = 1;
    }
  }, [isDragging]);

  if (!open) return null;

  return (
    <>
      <div className="fixed bottom-0 bg-background-500 border-t border-tertiary-500 p-3 flex items-center w-full">
        <div className="absolute top-[8px] right-[8px] cursor-pointer">
          <XIcon className="h-[10px] w-[10px]" onClick={handleClose} />
        </div>
        <div className="flex flex-col w-full max-w-[900px] mx-auto">
          <TimelineSlider
            percent={perc}
            onChange={handleTimelineChange}
            setIsDragging={setIsDragging}
          />
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-[5px]">
              {track && (
                <>
                  <p className="font-bold text-[20px] text-primary-500">
                    {track.release.primary_artist?.name ?? "Unknown artist"}
                  </p>
                  <hr className="border border-secondary-500" />
                  <p className="font-bold text-[20px] text-primary-500">
                    <span className="text-tertiary-500">{track.title}</span>
                  </p>
                </>
              )}
            </div>
            <div className="text-[30px] text-primary-500">
              <PlayIcon state={playState} onClick={handleButtonClick} />
            </div>
            <div>
              <PlayerTime currentTime={currentTime} duration={duration} />
            </div>
          </div>
        </div>
      </div>
      {trackURL && (
        <audio
          ref={trackRef}
          src={trackURL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlayState("paused")}
          onPause={() => setPlayState("paused")}
        />
      )}
    </>
  );
};
