"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { get } from "@/_utils/api.client";

import { Listing } from "./Listing";

import type { QueryParams } from "./types";
import type { Article } from "@/_types/api";

type PaginatorProps = {
  queryParams?: QueryParams;
};

export const Paginator = ({ queryParams = {} }: PaginatorProps) => {
  const [page, setPage] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const trigger = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const hasInitialised = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoading || isEnd) return;
    setIsLoading(true);
    const articlesResponse = await get<Article[]>({
      endpoint: "articles",
      data: {
        ...{ page },
        artist: queryParams.artist,
        type: queryParams.type,
        author: queryParams.author,
        artist_user: queryParams.artistUser,
      },
    });
    if (articlesResponse.ok) {
      const { data: newArticles } = articlesResponse;
      if (newArticles.length === 0) {
        setIsEnd(true);
      } else {
        setArticles((prev) => [...prev, ...newArticles]);
        setPage((prev) => prev + 1);
      }
    }
    setIsLoading(false);
  }, [isLoading, isEnd, queryParams]);

  useEffect(() => {
    if (isEnd) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (!hasInitialised.current) {
          hasInitialised.current = true;
          return;
        }
        if (entries[0]) loadMore();
      },
      { rootMargin: "150px" },
    );
    if (trigger.current) observer.current.observe(trigger.current);

    return () => observer.current?.disconnect();
  }, [isEnd, loadMore]);

  return (
    <>
      <Listing articles={articles} />
      <div className="w-full h-[1px]" ref={trigger} />
    </>
  );
};
