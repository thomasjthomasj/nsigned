"use client";

import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TimelineSliderProps = {
  percent: number;
  onChange: (perc: number) => void;
  setIsDragging: (dragging: boolean) => void;
};

export const TimelineSlider = ({
  percent: basePercent,
  onChange,
  setIsDragging,
}: TimelineSliderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef<boolean>(false);

  const percent = useMemo(() => {
    if (basePercent < 0) return 0;
    if (basePercent > 100) return 100;
    return basePercent;
  }, [basePercent]);

  const getXPercent = useCallback((x: number) => {
    const container = containerRef.current;
    if (!container) return 0;
    const { left, width } = container.getBoundingClientRect();
    const perc = ((x - left) / width) * 100;
    return Math.min(100, Math.max(0, perc));
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging.current) return;
      onChange(getXPercent(e.clientX));
    },
    [getXPercent, onChange],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      isDragging.current = false;
      setIsDragging(false);
      onChange(getXPercent(e.clientX));
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    },
    [getXPercent, onChange, setIsDragging],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      setIsDragging(true);
      onChange(getXPercent(e.clientX));
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [getXPercent, onChange, setIsDragging],
  );

  return (
    <div className="flex flex-col w-full p-[10px]">
      <div
        className="relative h-[10px]"
        ref={containerRef}
        onPointerDown={handlePointerDown}
      >
        {/* Base line */}
        <div className="absolute top-1/2 w-full border-b border-primary-500 h-0 -translate-y-1/2 z-0" />
        {/* Progress */}
        <div
          className="absolute top-1/2 h-[5px] bg-primary-500 -translate-y-1/2 z-0"
          style={{ width: `${percent}%` }}
        />
        {/* Slider */}
        <div
          className={classNames(
            "absolute top-1/2 h-[16px] w-[16px] rounded-full border border-primary-500 bg-primary-300",
            {
              "cursor-pointer": !isDragging,
              "cursor-grab": isDragging,
            },
          )}
          style={{
            left: `${percent}%`,
            transform: "translateX(-50%) translateY(-50%)",
          }}
        />
      </div>
    </div>
  );
};
