import { parseISODate } from "@/_utils/text";

import type { Article } from "@/_types/api";

type BlogArticleLinkProps = {
  article: Article;
  showAuthor?: boolean;
};

export const BlogArticleLink = ({
  article,
  showAuthor,
}: BlogArticleLinkProps) => (
  <a href={`/article/${article.id}/${article.slug}`}>
    <div>
      <h3>{article.title}</h3>
      <p className="italic text-nowrap leading-[12px] pl-[20px]">
        {showAuthor && (
          <>
            written by{" "}
            <span className="!text-tertiary-500">
              {article.created_by.display_name}
            </span>
          </>
        )}
        <span className="text-foreground-500">
          {" "}
          <time dateTime={article.published_at}>
            {parseISODate(article.published_at)}
          </time>
        </span>
      </p>
    </div>
  </a>
);
