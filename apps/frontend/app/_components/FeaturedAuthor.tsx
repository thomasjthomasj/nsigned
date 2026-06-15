import { ReviewGrid } from "@/_components/ReviewGrid";

import type { Author, Article } from "@/_types/api";

type FeaturedAuthorProps = {
  author: Author;
  articles: Article[];
};

export const FeaturedAuthor = ({ author, articles }: FeaturedAuthorProps) => {
  if (!articles.length) return null;
  return (
    <div className="flex flex-col">
      <h2>
        <a href={`/profile/${author.username}`}>
          Featured writer
          <br />
          <span className="font-bold italic text-secondary-500">
            {author.display_name}
          </span>
        </a>
      </h2>
      <div className="px-[10px]">
        <ReviewGrid articles={articles} />
      </div>
    </div>
  );
};
