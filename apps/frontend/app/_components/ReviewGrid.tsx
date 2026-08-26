import classNames from "classnames";

import type { Article } from "@/_types/api";

type ReviewGridProps = {
  articles: Article[];
  className?: string;
  textClassName?: string;
};

export const ReviewGrid = ({
  articles,
  className,
  textClassName,
}: ReviewGridProps) => (
  <div
    className={classNames(
      "w-full grid grid-cols-4 lg:grid-cols-2 gap-[10px]",
      className,
    )}
  >
    {articles.map((a) => {
      if (!a.release) return null;
      const imgURL = a.release.images.md.url;
      return (
        <a key={a.id} href={`/article/${a.id}/${a.slug}`}>
          <div className="flex flex-col">
            <img src={imgURL} alt={`"${a.release.title}" cover art`} />
          </div>
          <h5
            className={classNames(
              "text-[12px] overflow-hidden text-ellipsis line-clamp-2",
              textClassName,
            )}
          >
            {a.release.title}
          </h5>
        </a>
      );
    })}
  </div>
);
