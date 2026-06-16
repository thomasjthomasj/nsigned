"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { get } from "@/_utils/api.client";

import { DiscordCTA, DonateCTA, ReviewCTA } from "./_slides";

const RR_THRESHOLD = 15;
const SLIDE_INTERVAL = 10 * 1000;

export const CTACarousel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviewRequestCount, setReviewRequestCount] = useState<number | null>(
    0,
  );
  const [slide, setSlide] = useState<number>(0);

  useEffect(() => {
    const loadReviewRequestCount = async () => {
      setIsLoading(true);
      try {
        const countResponse = await get<number>({
          endpoint: "music/review-requests/count",
          withAuth: false,
        });
        if (countResponse.ok) {
          setReviewRequestCount(countResponse.data);
        }
      } catch {
        // Do nothing
      }
      setIsLoading(false);
    };
    loadReviewRequestCount();
  }, []);

  const slides = useMemo(
    () =>
      [
        ...(reviewRequestCount && reviewRequestCount >= RR_THRESHOLD
          ? [<ReviewCTA key="review-cta" count={reviewRequestCount} />]
          : []),
        <DiscordCTA key="discord-cta" />,
        <DonateCTA key="donate-cta" />,
      ] as const,
    [reviewRequestCount],
  );

  useEffect(() => {
    if (isLoading) return;
    const id = setInterval(() => {
      setSlide((prev) => {
        const length = slides.length;
        return length ? (prev + 1) % length : 0;
      });
    }, SLIDE_INTERVAL);

    return () => clearInterval(id);
  }, [slides]);

  if (isLoading || !reviewRequestCount) return null;

  return <div className="flex flex-col p-[20px] h-full">{slides[slide]}</div>;
};
