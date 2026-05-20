import { redirect } from "next/navigation";
import { Fragment } from "react";

import { AuthorCard } from "@/_components/AuthorCard";
import { Comments } from "@/_components/Comments";
import { MoreReviews } from "@/_components/MoreReviews";
import { PageLayout } from "@/_components/PageLayout";
import { EditArticle } from "@/_components/_forms/EditArticle";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";
import { parseISODate, sanitizeHtml } from "@/_utils/text";

import type {
  Article as ArticleType,
  ArticleFull,
  Comment,
} from "@/_types/api";

type ArticleProps = {
  params: Promise<{
    id: number;
    slug: string;
  }>;
};

const Article = async ({ params }: ArticleProps) => {
  const { id, slug } = await params;

  const articleCacheKey = getCacheKey({
    key: CACHE_KEY.ARTICLE,
    idVal: id,
  });
  const commentsCacheKey = getCacheKey({
    key: CACHE_KEY.ARTICLE_COMMENTS,
    idVal: id,
  });
  const [articleResponse, commentsResponse] = await Promise.all([
    get<ArticleFull>({
      endpoint: `articles/${id}`,
      withAuth: false,
      cacheKey: articleCacheKey,
    }),
    get<Comment[]>({
      endpoint: `articles/${id}/comments`,
      withAuth: false,
      cacheKey: commentsCacheKey,
    }),
  ]);
  if (!articleResponse.ok)
    return handleError({
      errorResponse: articleResponse,
    });

  const article = articleResponse.data;
  if (!article.content)
    return handleError({ message: "Article has no content" });

  if (article.slug !== slug) return redirect(`/article/${id}/${slug}`);
  const { title, created_by: author, release } = article;

  const comments = commentsResponse.ok ? commentsResponse.data : [];

  const moreArticles = await (async () => {
    if (!release?.primary_artist) return [];
    const moreArticlesCacheKey = getCacheKey({
      key: CACHE_KEY.ARTICLES,
      getData: {
        artist: release.primary_artist.slug,
        page_size: 4,
        exclude: article.id,
      },
    });
    const moreArticlesResponse = await get<ArticleType[]>({
      endpoint: "articles",
      data: {
        artist: release.primary_artist.slug,
        page_size: 4,
        exclude: article.id,
      },
      cacheKey: moreArticlesCacheKey,
    });
    if (!moreArticlesResponse.ok) return [];
    return moreArticlesResponse.data;
  })();

  const images = release?.images ?? null;
  const content = sanitizeHtml(article.content.content);
  const link = release?.links[0];

  const links = (() => {
    const ls: { url: string; text: string }[] = [];
    if (!release) return [];
    if (link)
      ls.push({
        url: link.url,
        text: `Purchase "${release.title}"`,
      });
    if (author.fundraiser_link)
      ls.push({
        url: author.fundraiser_link,
        text: `Support ${author.display_name}`,
      });

    return ls;
  })();

  if (article.deleted) {
    return (
      <PageLayout title="Deleted article">
        <div className="w-full">
          <p>
            This article has been deleted
            {article.deleted_reason ? `: ${article.deleted_reason}` : "."}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title}>
      <div className="flex flex-col w-full gap-[15px]">
        <div className="mb-[10px] flex justify-between">
          <AuthorCard user={author} />
          <p className="text-foreground-500 text-[12px] italic w-fullflex justify-end gap-1 text-nowrap">
            <span>Published</span>{" "}
            <time dateTime={article.published_at}>
              {parseISODate(article.published_at)}
            </time>
          </p>
        </div>
        <div className="w-full">
          <div id={`article-body-${article.id}`}>
            {release && images && (
              <div className="pr-[20px] pb-[10px] sm:float-left">
                <a href={images.lg.url} target="_blank">
                  <img
                    src={images.md.url}
                    height={images.md.height}
                    width={images.md.width}
                    alt={`${release.title} cover art`}
                  />
                </a>
              </div>
            )}
            <div
              className="space-y-[10px]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          <EditArticle
            article={article}
            containerID={`article-body-${article.id}`}
          />
          {!!links.length && (
            <p className="mt-[15px] text-[1.2rem] font-bold">
              {links.map((l, i) => (
                <Fragment key={i}>
                  <a href={l.url} target="_blank">
                    {l.text}
                  </a>
                  {i < links.length - 1 && (
                    <span className="ml-2 mr-1">//</span>
                  )}
                </Fragment>
              ))}
            </p>
          )}
        </div>
        {release && <Comments article={article} comments={comments} />}
        {release?.primary_artist && !!moreArticles.length && (
          <div className="">
            <MoreReviews
              articles={moreArticles}
              title={`More from this artist`}
              archiveLink={`/archive?artist=${release!.primary_artist!.slug}`}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Article;
