"use client";

import { useEffect, useState } from "react";

import { ReviewGrid } from "@/_components/ReviewGrid";
import { get } from "@/_utils/api.client";

import type { Article } from "@/_types/api";

type RandomReviewsProps = {
  exclude: number[];
};

export const RandomReviews = ({ exclude }: RandomReviewsProps) => {
  const [reviews, setReviews] = useState<Article[]>([]);

  useEffect(() => {
    const loadReviews = async () => {
      const articleResponse = await get<Article[]>({
        endpoint: "articles/random",
        data: { exclude: exclude.sort().join(",") },
        withAuth: false,
      });
      if (articleResponse.ok) setReviews(articleResponse.data);
    };
    loadReviews();
  }, []);

  if (!reviews.length) return null;

  return (
    <>
      <h2>
        <a href="/archive">From the archive</a>
      </h2>
      <div className="px-[10px]">
        <ReviewGrid articles={reviews} />
      </div>
    </>
  );
};
