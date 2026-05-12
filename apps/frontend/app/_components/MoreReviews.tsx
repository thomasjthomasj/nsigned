import { upper } from "@/_utils/text";

import type { Article } from "@/_types/api";

type ProfileReviewsProps = {
  articles: Article[];
  title: string;
  archiveLink: string;
};

export const MoreReviews = ({
  articles,
  title,
  archiveLink,
}: ProfileReviewsProps) =>
  !!articles.length && (
    <div className="flex flex-col gap-[10px]">
      <h2>
        <a href={archiveLink}>{title}</a>
      </h2>
      <div className="grid grid-cols-4 gap-[5px]">
        {articles.map((r) => {
          const { release } = r;
          if (!release) return null;
          return (
            <a key={r.id} href={`/article/${r.id}/${r.slug}`}>
              <div className="flex flex-col h-full w-full shrink-0 gap-[5px]">
                <img
                  src={release.images.md.url}
                  alt={`${release.title} cover art`}
                  height={180}
                  width={180}
                />
                <div className="flex flex-col">
                  {release.primary_artist && (
                    <h4 className="text-[10px]">
                      {release.primary_artist.name}
                    </h4>
                  )}
                  <h3 className="!text-[12px]">{release.title}</h3>
                  <p className="text-[10px]">
                    {upper(release.release_type)} review
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
