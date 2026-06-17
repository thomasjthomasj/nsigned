import { BlogArticleLink } from "@/_components/BlogArticleLink";
import { parseISODate } from "@/_utils/text";

import type { Article } from "@/_types/api";

type BlogArticleProps = {
  articles: Article[];
  showAuthor?: boolean;
};

export const BlogListing = ({ articles, showAuthor }: BlogArticleProps) => (
  <div className="w-full flex flex-col gap-[15px]">
    {articles.map((a) => (
      <BlogArticleLink key={a.id} article={a} showAuthor={showAuthor} />
    ))}
  </div>
);
