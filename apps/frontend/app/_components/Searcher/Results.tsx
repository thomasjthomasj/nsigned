import { ArticleListing } from "@/_components/ArticleListing";

import type { Article } from "@/_types/api";

type ResultsProps = {
  articles: Article[];
};

export const Results = ({ articles }: ResultsProps) => (
  <div className="w-full flex flex-col gap-[20px]">
    {!articles.length && <p>No articles matched your query</p>}
    {!!articles.length && <ArticleListing articles={articles} />}
  </div>
);
