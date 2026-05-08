import classNames from "classnames";

import { Error } from "@/_components/Error";
import { GeneralArticles } from "@/_components/GeneralArticles";
import { get } from "@/_utils/api.server";

import type { Article } from "@/_types/api";

const Home = async () => {
  const [generalResponse, albumResponse, trackResponse] = await Promise.all([
    get<Article[]>({
      endpoint: "articles",
      data: { type: "general", page_size: 4 },
      withAuth: false,
    }),
    get<Article[]>({
      endpoint: "articles",
      data: { type: "album" },
      withAuth: false,
    }),
    get<Article[]>({
      endpoint: "articles",
      data: { type: "track" },
      withAuth: false,
    }),
  ]);

  const ok = generalResponse.ok && albumResponse.ok && trackResponse.ok;

  if (!ok)
    return (
      <Error error="The articles didn't load properly, please check back later." />
    );

  const { data: general } = generalResponse;
  const { data: albums } = albumResponse;
  const { data: tracks } = trackResponse;

  return (
    <div className="w-full flex flex-col">
      <GeneralArticles articles={general} />
      <div className="grid grid-cols-3">
        <div className="flex flex-col gap-[10px] col-span-2">
          <h2>Album reviews</h2>
          {albums.map((a) => {
            const { release } = a;
            if (!release) return null;
            return (
              <a key={a.id} href={`/article/${a.id}/${a.slug}`}>
                <div className="flex gap-[10px]">
                  <div className="p-[10px] shrink-0">
                    <img
                      src={release.images.md.url}
                      alt={`${release.title} cover art`}
                      height="250"
                      width="250"
                    />
                  </div>
                  <div>
                    <h3>{release.title}</h3>
                    {release.primary_artist && (
                      <h4>{release.primary_artist.name}</h4>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
        <div className="flex flex-col gap-[10px]">
          <h2>Track reviews</h2>
          {tracks.map((t) => {
            const { release } = t;
            if (!release) return null;
            return (
              <a key={t.id} href={`/article/${t.id}/${t.slug}`}>
                <div className="flex gap-[10px]" key={t.id}>
                  <div className="p-[10px] shrink-0">
                    <img
                      src={release.images.sm.url}
                      alt={`${release.title} cover art`}
                      height="96"
                      width="96"
                    />
                  </div>
                  <div>
                    <h3>{release.title}</h3>
                    {release.primary_artist && (
                      <h4>{release.primary_artist.name}</h4>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
