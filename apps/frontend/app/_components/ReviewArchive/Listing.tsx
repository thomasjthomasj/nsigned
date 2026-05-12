import { ReleaseArticleLink } from "@/_components/ReleaseArticleLink";

import type { Article } from "@/_types/api";

type ListingProps = {
  articles: Article[];
};

export const Listing = ({ articles }: ListingProps) => (
  <>
    {articles.map((a) => (
      <ReleaseArticleLink key={a.id} article={a} size="lg" showReviewType />
    ))}
  </>
);
