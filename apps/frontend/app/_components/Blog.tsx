import { BlogListing } from "@/_components/BlogListing";

import type { Article } from "@/_types/api";

type GeneralArticlesProps = {
  title?: string;
  articles: Article[];
};

export const Blog = ({ title = "Blog", articles }: GeneralArticlesProps) => {
  if (!articles.length) return null;

  return (
    <div className="w-full flex flex-col">
      <h2>
        <a href="/blog">{title}</a>
      </h2>
      <BlogListing articles={articles} />
    </div>
  );
};
