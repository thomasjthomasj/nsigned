"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/_hooks";
import { get } from "@/_utils/api.client";

import { DiscordCTA, DonateCTA, ReviewCTA, SubmitCTA } from "./_slides";

const RR_THRESHOLD = 15;
const SLIDE_INTERVAL = 12 * 1000;

export const CTACarousel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [reviewRequestCount, setReviewRequestCount] = useState<number | null>(
    0,
  );
  const [slide, setSlide] = useState<number>(0);
  const { user, loading: userLoading } = useAuth();

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
        (next: () => void) => (
          <SubmitCTA
            key="submit-cta"
            next={next}
            user={user}
            userLoading={userLoading}
          />
        ),
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
        ...(user
          ? [(next: () => void) => <DonateCTA key="donate-cta" next={next} />]
          : []),
      ] as const,
    [reviewRequestCount, user, userLoading],
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
        <SubmitCTA
          key="submit-cta"
          next={next}
          user={user}
          userLoading={userLoading}
        />
      </div>
    );

  return (
    <div className="flex flex-col p-[20px] flex-1">
      {slides[slide](handleNext)}
    </div>
  );
};
