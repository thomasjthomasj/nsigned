import { PageLayout } from "@/_components/PageLayout";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { ArtistMeta } from "@/_types/api";

const Artists = async () => {
  const artistsResponse = await get<ArtistMeta[]>({
    endpoint: "music/artists",
    cacheKey: getCacheKey({ key: CACHE_KEY.ARTISTS }),
    withAuth: false,
  });

  if (!artistsResponse.ok)
    return handleError({ errorResponse: artistsResponse });

  const { data: artists } = artistsResponse;

  return (
    <PageLayout title="Artists">
      <div className="flex flex-col gap-[20px]">
        <ul>
          {artists.map((a) => (
            <li key={a.id}>
              <a href={`/artist/${a.slug}`}>{a.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
};

export default Artists;
