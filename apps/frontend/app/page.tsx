import { Error } from "@/_components/Error";
import { Blog } from "@/_components/Blog";
import { ReleaseArticleLink } from "@/_components/ReleaseArticleLink";
import { get } from "@/_utils/api.server";

import type { Article } from "@/_types/api";

const Home = async () => {
  const [blogResponse, albumResponse, trackResponse] = await Promise.all([
    get<Article[]>({
      endpoint: "articles",
      data: { type: "blog", page_size: 4 },
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

  const ok = blogResponse.ok && albumResponse.ok && trackResponse.ok;

  if (!ok)
    return (
      <Error error="The articles didn't load properly, please check back later." />
    );

  const { data: blog } = blogResponse;
  const { data: albums } = albumResponse;
  const { data: tracks } = trackResponse;

  const reviews = [...albums, ...tracks].sort((a, b) =>
    b.published_at.localeCompare(a.published_at),
  );

  return (
    <div className="w-full flex flex-col gap-[15px]">
      <Blog articles={blog} />
      <div className="hidden md:grid grid-cols-3 gap-[10px]">
        <div className="flex flex-col col-span-2">
          <h2>Album reviews</h2>
          {albums.map((a) => (
            <ReleaseArticleLink article={a} key={a.id} />
          ))}
        </div>
        <div className="flex flex-col">
          <h2>Track reviews</h2>
          {tracks.map((a) => (
            <ReleaseArticleLink article={a} key={a.id} />
          ))}
        </div>
      </div>
      <div className="flex flex-col block md:hidden">
        <h2>Reviews</h2>
        {reviews.map((a) => (
          <ReleaseArticleLink article={a} key={a.id} size="sm" showReviewType />
        ))}
      </div>
    </div>
  );
};

export default Home;
