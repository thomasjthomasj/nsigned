import { BlogArticleLink } from "@/_components/BlogArticleLink";
import { ReleaseArticleLink } from "@/_components/ReleaseArticleLink";

import type { Article } from "@/_types/api";

type ArticleListingProps = {
  articles: Article[];
};

export const ArticleListing = ({ articles }: ArticleListingProps) => (
  <>
    {articles.map((a) =>
      a.release ? (
        <ReleaseArticleLink key={a.id} article={a} size="lg" showReviewType />
      ) : (
        <BlogArticleLink key={a.id} article={a} showAuthor />
      ),
    )}
  </>
);
