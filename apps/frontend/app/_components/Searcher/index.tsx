"use client";

import { useEffect, useState } from "react";

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
  const [term, setTerm] = useState<string>(initialTerm);
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  return (
    <div className="flex flex-col gap-[15px]">
      <SearchBar term={term} onChange={setTerm} />
      <Results articles={articles} />
    </div>
  );
};
