import type { Article } from "@/_types/api";

type ReviewGridProps = {
  articles: Article[];
};

export const ReviewGrid = ({ articles }: ReviewGridProps) => (
  <div className="w-full grid grid-cols-4 lg:grid-cols-2 gap-[10px]">
    {articles.map((a) => {
      if (!a.release) return null;
      const imgURL = a.release.images.md.url;
      return (
        <a key={a.id} href={`/article/${a.id}/${a.slug}`}>
          <div className="flex flex-col">
            <img src={imgURL} alt={a.release.title} />
          </div>
          <h5 className="text-[12px] overflow-hidden text-ellipsis line-clamp-2">
            {a.release.title}
          </h5>
        </a>
      );
    })}
  </div>
);
