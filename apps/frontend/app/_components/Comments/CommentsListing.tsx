import classNames from "classnames";

import { AuthorCard } from "@/_components/AuthorCard";
import { sanitizeHtml, parseISOLocalTime } from "@/_utils/text";

import type { Comment } from "@/_types/api";

type CommentsListingProps = {
  comments: Comment[];
};

export const CommentsListing = ({ comments }: CommentsListingProps) => (
  <div
    className={classNames("w-full flex flex-col", {
      hidden: comments.length === 0,
    })}
  >
    {comments.map((c, i) => (
      <div
        className={classNames(
          "flex flex-col p-[10px] border-t border-secondary-500 gap-[10px] pt-[20px] pl-[20px]",
          {
            "bg-background": i % 2,
            "bg-background-500": !(i % 2),
          },
        )}
        key={c.id}
        id={`comment-${c.id}`}
      >
        <div
          className="space-y-[10px]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(c.content) }}
        />
        <div className="flex justify-between">
          <AuthorCard user={c.created_by} />
          <p className="text-foreground-500 italic text-[12px] w-full flex justify-end">
            <time dateTime={c.created_at}>
              {parseISOLocalTime(c.created_at)}
            </time>
          </p>
        </div>
      </div>
    ))}
  </div>
);
