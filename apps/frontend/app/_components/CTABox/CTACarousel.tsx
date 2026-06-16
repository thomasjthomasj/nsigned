"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { get } from "@/_utils/api.client";

import { DiscordCTA, DonateCTA, ReviewCTA } from "./_slides";

const RR_THRESHOLD = 15;
const SLIDE_INTERVAL = 12 * 1000;

export const CTACarousel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);
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
          ? [
              (next: () => void) => (
                <ReviewCTA
                  key="review-cta"
                  count={reviewRequestCount}
                  next={next}
                />
              ),
            ]
          : []),
        (next: () => void) => <DiscordCTA key="discord-cta" next={next} />,
        (next: () => void) => <DonateCTA key="donate-cta" next={next} />,
      ] as const,
    [reviewRequestCount],
  );

  const next = useCallback(() => {
    setSlide((prev) => {
      const length = slides.length;
      return length ? (prev + 1) % length : 0;
    });
  }, [slides]);

  const handleNext = useCallback(() => {
    setIsActive(false);
    next();
  }, [next]);

  useEffect(() => {
    if (isLoading) return;
    const id = setInterval(() => {
      if (!isActive) return;
      next();
    }, SLIDE_INTERVAL);

    return () => clearInterval(id);
  }, [isLoading, next, isActive]);

  if (isLoading)
    return (
      <div className="flex flex-col p-[20px] flex-1">
        <ReviewCTA key="review-cta" next={next} />
      </div>
    );

  return (
    <div className="flex flex-col p-[20px] flex-1">
      {slides[slide](handleNext)}
    </div>
  );
};
