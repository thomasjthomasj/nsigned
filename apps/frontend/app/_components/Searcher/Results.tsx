import classNames from "classnames";

import { ArticleListing } from "@/_components/ArticleListing";

import type { Article } from "@/_types/api";

type ResultsProps = {
  articles: Article[];
  isSearching: boolean;
};

export const Results = ({ articles, isSearching }: ResultsProps) => (
  <div
    className={classNames(
      "w-full flex flex-col gap-[20px] transition-opacity",
      {
        "opacity-50": isSearching,
      },
    )}
  >
    {!articles.length && <p>No articles matched your query</p>}
    {!!articles.length && <ArticleListing articles={articles} />}
  </div>
);
