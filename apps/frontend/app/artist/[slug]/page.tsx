import { PageLayout } from "@/_components/PageLayout";
import { ReviewArchive } from "@/_components/ReviewArchive";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Article, Artist as ArtistType } from "@/_types/api";

type ArtistProps = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: ArtistProps) => {
  const { slug } = await params;
  const artistResponse = await get<ArtistType>({
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
    get<ArtistType>({
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

  return (
    <PageLayout title={artist.name}>
      <div className="w-full">
        <ReviewArchive articles={articles} />
      </div>
    </PageLayout>
  );
};

export default Artist;
