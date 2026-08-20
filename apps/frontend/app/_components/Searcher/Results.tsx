import classNames from "classnames";

import { ArticleListing } from "@/_components/ArticleListing";

import type { Article } from "@/_types/api";

type ResultsProps = {
  articles: Article[];
  isLoading: boolean;
};

export const Results = ({ articles, isLoading }: ResultsProps) => (
  <div
    className={classNames(
      "w-full flex flex-col gap-[20px] transition-opacity",
      {
        "opacity-80": isLoading,
      },
    )}
  >
    {!articles.length && <p>No articles matched your query</p>}
    {!!articles.length && <ArticleListing articles={articles} />}
  </div>
);
