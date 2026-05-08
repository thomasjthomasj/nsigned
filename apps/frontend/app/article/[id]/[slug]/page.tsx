import { redirect } from "next/navigation";

import { AuthorCard } from "@/_components/AuthorCard";
import { Error } from "@/_components/Error";
import { PageLayout } from "@/_components/PageLayout";
import { get } from "@/_utils/api.server";
import { sanitizeHtml } from "@/_utils/text";

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
        <AuthorCard user={author} />
        <div className="w-full">
          {release && images && (
            <div className="p-[10px] float-left">
              <img
                src={images.md.url}
                height={images.md.height}
                width={images.md.width}
                alt={`${release.title} cover art`}
              />
            </div>
          )}
          {link && (
            <a href={link.url} target="_blank">
              Listen here
            </a>
          )}
          <div
            className="space-y-[10px]"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Article;
