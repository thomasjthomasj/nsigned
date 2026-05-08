import { redirect } from "next/navigation";

import { AuthorCard } from "@/_components/AuthorCard";
import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { get } from "@/_utils/api.server";
import { parseISODate, sanitizeHtml } from "@/_utils/text";

import type { ArticleFull } from "@/_types/api";

type ArticleProps = {
  params: Promise<{
    id: number;
    slug: string;
  }>;
};

const Article = async ({ params }: ArticleProps) => {
  const { id, slug } = await params;
  const articleResponse = await get<ArticleFull>({
    endpoint: `articles/${id}`,
    withAuth: false,
  });
  if (!articleResponse.ok)
    return (
      <Error
        error={articleResponse.status === 404 ? "Article not found" : undefined}
      />
    );

  const article = articleResponse.data;
  if (!article.content) {
    return <Error />;
  }
  if (article.slug !== slug) return redirect(`/article/${id}/${slug}`);
  const { title, created_by: author, release } = article;
  const images = release?.images ?? null;
  const content = sanitizeHtml(article.content.content);
  const link = release?.links[0];

  return (
    <PageLayout title={title}>
      <div className="flex flex-col w-full">
        <div className="mb-[10px]">
          <AuthorCard user={author} />
          {link && (
            <p className="text-[1.2rem] font-bold">
              <a href={link.url} target="_blank">
                Purchase here
              </a>
            </p>
          )}
        </div>
        <div className="w-full">
          {release && images && (
            <div className="pr-[20px] pb-[10px] sm:float-left">
              <img
                src={images.md.url}
                height={images.md.height}
                width={images.md.width}
                alt={`${release.title} cover art`}
              />
            </div>
          )}
          <div
            className="space-y-[10px]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <p className="mt-[10px] text-foreground-500 text-[12px] italic">
            Published{" "}
            <time dateTime={article.published_at}>
              {parseISODate(article.published_at)}
            </time>
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Article;
