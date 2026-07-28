import { redirect } from "next/navigation";

import { PageLayout } from "@/_components/PageLayout";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { Release as ReleaseType } from "@/_types/api";

type ReleaseProps = {
  params: Promise<{
    artistSlug: string;
    releaseID: number;
    releaseSlug: string;
  }>;
};

const Release = async ({ params }: ReleaseProps) => {
  const { artistSlug, releaseID, releaseSlug } = await params;

  const releaseResponse = await get<ReleaseType>({
    endpoint: `music/release/${releaseID}`,
    cacheKey: getCacheKey({ key: CACHE_KEY.RELEASE, idVal: releaseID }),
  });
  if (!releaseResponse.ok)
    return handleError({ errorResponse: releaseResponse });

  const release = releaseResponse.data;

  if (release.primary_artist?.slug !== artistSlug)
    return handleError({ status: 404 });

  if (release.slug !== releaseSlug)
    return redirect(`/${artistSlug}/${releaseID}/${releaseSlug}`);

  const pageTitle = `${release.primary_artist.name} - ${release.title}`;
  const { images, title, primary_artist: artist, tracks } = release;

  return (
    <PageLayout title={pageTitle}>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row gap-[20px]">
          <div>
            <div className="pr-[20px] pb-[10px] sm:float-left">
              <img
                className="w-full sm:w-auto"
                src={images.md.url}
                height={images.md.height}
                width={images.md.width}
                alt={`${release.title} cover art`}
              />
            </div>
            <div className="flex flex-col gap-[20px]">
              <h2>{artist.name}</h2>
              <h3>{title}</h3>
              {!!tracks.length && (
                <ol>
                  {tracks.map((t) => (
                    <li>{t.title}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Release;
