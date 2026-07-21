"use client";

import { useMemo } from "react";

import { getPlayerTime } from "@/_utils/time";

type PlayerTimeProps = {
  currentTime: number;
  duration: number;
};

export const PlayerTime = ({ currentTime, duration }: PlayerTimeProps) => {
  const total = useMemo(() => getPlayerTime(duration), [duration]);
  const current = useMemo(() => getPlayerTime(currentTime), [currentTime]);

  return (
    <p className="text-[24px] font-bold">
      <span className="text-tertiary-500">{current}</span>
      <span className="text-secondary-500 font-normal">//</span>
      <span className="text-primary-500">{total}</span>
    </p>
  );
};
