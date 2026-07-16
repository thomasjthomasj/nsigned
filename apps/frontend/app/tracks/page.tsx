import { PageLayout } from "@/_components/PageLayout";
import { TrackOverview } from "@/_components/TrackOverview";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Track } from "@/_types/api";

const Tracks = async () => {
  const tracksResponse = await get<Track[]>({
    endpoint: "music/tracks",
    cacheKey: getCacheKey({
      key: CACHE_KEY.TRACKS,
    }),
  });

  if (!tracksResponse.ok)
    return handleError({
      errorResponse: tracksResponse,
    });

  const tracks = tracksResponse.data;

  return (
    <PageLayout title="Tracks">
      <div className="flex flex-col w-full gap-[15px]">
        {tracks.length ? (
          <div className="flex flex-col w-full gap-[10px]">
            {tracks.map((t) => (
              <TrackOverview key={t.id} track={t} />
            ))}
          </div>
        ) : (
          <p>there are no tracks</p>
        )}
      </div>
    </PageLayout>
  );
};

export default Tracks;
