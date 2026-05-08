import type { Article } from "@/_types/api";

type GeneralArticlesProps = {
  articles: Article[];
};

export const GeneralArticles = ({ articles }: GeneralArticlesProps) => {
  if (!articles.length) return null;

  return (
    <div className="w-full flex flex-col">
      <h2>Read this</h2>
      <div className="w-full grid grid-cols-4 gap-[5px]">
        {articles.map((a) => (
          <a key={a.id} href={`/article/${a.id}/${a.slug}`}>
            {a.title}
          </a>
        ))}
      </div>
    </div>
  );
};
