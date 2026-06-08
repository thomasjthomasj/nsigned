import { parseISODate } from "@/_utils/text";

import type { Article } from "@/_types/api";

type BlogArticleProps = {
  articles: Article[];
  showAuthor?: boolean;
};

export const BlogListing = ({ articles, showAuthor }: BlogArticleProps) => (
  <div className="w-full flex flex-col gap-[15px]">
    {articles.map((a) => (
      <a key={a.id} href={`/article/${a.id}/${a.slug}`}>
        <div>
          <h3>{a.title}</h3>
          <p className="italic text-nowrap leading-[12px] pl-[20px]">
            {showAuthor && (
              <>
                written by{" "}
                <span className="!text-tertiary-500">
                  {a.created_by.display_name}
                </span>
              </>
            )}
            <span className="text-foreground-500">
              {" "}
              <time dateTime={a.published_at}>
                {parseISODate(a.published_at)}
              </time>
            </span>
          </p>
        </div>
      </a>
    ))}
  </div>
);
