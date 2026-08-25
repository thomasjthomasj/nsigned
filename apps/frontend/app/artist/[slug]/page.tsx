import { PageLayout } from "@/_components/PageLayout"
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Artist } from "@/_types/api";

type ArtistProps = {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: ArtistProps) => {
  const { slug } = await params;
  const artistResponse = await get<Artist>({
    endpoint: `artist/${slug}`,
    withAuth: false,
    cacheKey: getCacheKey({
      key: CACHE_KEY.ARTIST,
      idVal: slug,
    })
  });

  if (!artistResponse.ok) return { title: "_nsigned" };

  return {
    title: `_nsigned // ${artistResponse.data.name}`,
  }
}

const Artist = async ({ params }: ArtistProps) => {
  const { slug } = await params;
  const artistResponse = await get<Artist>({
    endpoint: `artist/${slug}`,
    withAuth: false,
    cacheKey: getCacheKey({
      key: CACHE_KEY.ARTIST,
      idVal: slug,
    })
  });

  if (!artistResponse.ok) return handleError({ errorResponse: artistResponse });

  const { data: artist } = artistResponse;

  return (
    <PageLayout title={artist.name}>
      <div className="w-full"></div>
    </PageLayout>
  )
}

export default Artist;
