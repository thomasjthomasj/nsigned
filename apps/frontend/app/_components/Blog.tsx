import type { Article } from "@/_types/api";

type GeneralArticlesProps = {
  articles: Article[];
};

export const Blog = ({ articles }: GeneralArticlesProps) => {
  if (!articles.length) return null;

  return (
    <div className="w-full flex flex-col">
      <h2>Announcements</h2>
      <div className="w-full flex flex-col">
        <ul>
          {articles.map((a) => (
            <li key={a.id}>
              <a
                className="text-[1.2rem] leading-[1.2rem] p-[5px] hover:bg-background-500 !text-foreground"
                href={`/article/${a.id}/${a.slug}`}
              >
                {a.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
