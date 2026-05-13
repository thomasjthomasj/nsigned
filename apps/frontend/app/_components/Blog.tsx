import type { Article } from "@/_types/api";

type GeneralArticlesProps = {
  articles: Article[];
};

export const Blog = ({ articles }: GeneralArticlesProps) => {
  if (!articles.length) return null;

  return (
    <div className="w-full flex flex-col">
      <h2>Announcements</h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-[5px]">
        {articles.map((a) => (
          <a
            className="text-[1.2rem] p-[5px] hover:bg-background-500"
            key={a.id}
            href={`/article/${a.id}/${a.slug}`}
          >
            {a.title}
          </a>
        ))}
      </div>
    </div>
  );
};
