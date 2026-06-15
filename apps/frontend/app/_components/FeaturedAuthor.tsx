import { ReviewGrid } from "@/_components/ReviewGrid";

import type { Author, Article } from "@/_types/api";

type FeaturedAuthorProps = {
  author: Author,
  articles: Article[],
}

export const FeaturedAuthor = ({
  author,
  articles
}: FeaturedAuthorProps) => {
  if (!articles.length) return null;
  return <div className="flex flex-col">
    <h2>Featured writer<br /><a className="font-bold italic text-secondary-500" href={`/profile/${author.username}`}>{author.display_name}</a></h2>
    <div className="px-[10px]">
      <ReviewGrid articles={articles} />
    </div>
  </div>
}
