"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useDebounce } from "@/_hooks";
import { get } from "@/_utils/api.client";

import { Results } from "./Results";
import { SearchBar } from "./SearchBar";

import type { Article } from "@/_types/api";

type SearcherProps = {
  articles: Article[];
  term: string;
};

export const Searcher = ({
  articles: initialArticles,
  term: initialTerm,
}: SearcherProps) => {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [term, setTerm] = useState<string>(initialTerm);
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    const response = await get<Article[]>({
      endpoint: "articles/search",
      data: { term },
    });
    if (response.ok) setArticles(response.data);
    setIsLoading(false);
  }, [term]);

  const debouncedHandleSearch = useDebounce(handleSearch, 500);

  useEffect(() => {
    setIsTyping(true);
    if (term.length < 3) {
      setIsTyping(false);
      return;
    }
    debouncedHandleSearch();
  }, [term]);

  useEffect(() => {
    if (!isLoading) setIsTyping(false);
  }, [isLoading]);

  const isSearching = useMemo(
    () => isTyping || isLoading,
    [isTyping, isLoading],
  );

  return (
    <div className="flex flex-col gap-[15px]">
      <SearchBar term={term} onChange={setTerm} />
      <Results articles={articles} isSearching={isSearching} />
    </div>
  );
};
