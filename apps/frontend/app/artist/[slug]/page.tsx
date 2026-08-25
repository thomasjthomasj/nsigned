import { PageLayout } from "@/_components/PageLayout";
import { ReleaseArticleLink } from "@/_components/ReleaseArticleLink";
import { ReviewGrid } from "@/_components/ReviewGrid";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Article, ArtistFull } from "@/_types/api";

type ArtistProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: ArtistProps) => {
  const { slug } = await params;
  const artistResponse = await get<ArtistFull>({
    endpoint: `music/artist/${slug}`,
    withAuth: false,
    cacheKey: getCacheKey({
      key: CACHE_KEY.ARTIST,
      idVal: slug,
    }),
  });

  if (!artistResponse.ok) return { title: "_nsigned" };

  return {
    title: `_nsigned // ${artistResponse.data.name}`,
  };
};

const Artist = async ({ params }: ArtistProps) => {
  const { slug } = await params;
  const [artistResponse, articlesResponse] = await Promise.all([
    get<ArtistFull>({
      endpoint: `music/artist/${slug}`,
      withAuth: false,
      cacheKey: getCacheKey({
        key: CACHE_KEY.ARTIST,
        idVal: slug,
      }),
    }),
    get<Article[]>({
      endpoint: "articles",
      data: { artist: slug },
      cacheKey: getCacheKey({
        key: CACHE_KEY.ARTICLES,
        getData: { artist: slug },
      }),
    }),
  ]);

  if (!artistResponse.ok) return handleError({ errorResponse: artistResponse });
  if (!articlesResponse.ok)
    return handleError({ errorResponse: articlesResponse });

  const { data: artist } = artistResponse;
  const { data: articles } = articlesResponse;

  const top = artist.featured_review_id
    ? articles.filter((a) => a.id === artist.featured_review_id).shift()
    : null;
  const filteredArticles = top
    ? articles.filter((a) => a.id !== top.id)
    : articles;

  return (
    <PageLayout title={artist.name}>
      <div className="w-full flex flex-col gap-[25px] pt-[10px]">
        {top?.release && (
          <>
            <div className="hidden sm:flex flex-col border border-tertiary-500 p-[10px]">
              <ReleaseArticleLink article={top} size="lg" showReviewType />
            </div>
            <div className="block sm:hidden p-[10px] border border-tertiary-500">
              <a href={`/article/${top.id}/${top.slug}`}>
                <div className="flex flex-col items-center gap-[15px]">
                  <img
                    className="border border-background-500 w-full aspect-square"
                    src={top.release.images.md.url}
                    alt={`${top.release.title} cover art`}
                    height={300}
                    width={300}
                  />
                  <div className="flex flex-col items-center">
                    <h3>{top.release.title}</h3>
                  </div>
                </div>
              </a>
            </div>
          </>
        )}
        {!!filteredArticles.length && (
          <div>
            <ReviewGrid
              articles={filteredArticles}
              className="lg:grid-cols-4"
              textClassName="text-[14px] font-bold"
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Artist;
