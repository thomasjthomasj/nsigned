import { Blog } from "@/_components/Blog";
import { ReleaseArticleLink } from "@/_components/ReleaseArticleLink";
import { get } from "@/_utils/api.server";
import { handleError } from "@/_utils/errors.server";

import type { Article, ErrorResponse } from "@/_types/api";

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

  const handleArticlesError = (r: ErrorResponse) =>
    handleError({
      errorResponse: r,
      message: "The articles didn't load properly, please check back later",
    });
  if (!blogResponse.ok) return handleArticlesError(blogResponse);
  if (!albumResponse.ok) return handleArticlesError(albumResponse);
  if (!trackResponse.ok) return handleArticlesError(trackResponse);

  const { data: blog } = blogResponse;
  const { data: albums } = albumResponse;
  const { data: tracks } = trackResponse;

  const reviews = [...albums, ...tracks].sort((a, b) =>
    b.published_at.localeCompare(a.published_at),
  );

  return (
    <div className="w-full flex flex-col gap-[15px]">
      <Blog articles={blog} />
      <div className="hidden md:grid grid-cols-3 gap-[20px]">
        <div className="flex flex-col col-span-2">
          <h2>
            <a href="/archive">Album reviews</a>
          </h2>
          {albums.map((a) => (
            <ReleaseArticleLink article={a} key={a.id} />
          ))}
        </div>
        <div className="flex flex-col">
          <h2>
            <a href="/archive">Track reviews</a>
          </h2>
          {tracks.map((a) => (
            <ReleaseArticleLink article={a} key={a.id} />
          ))}
        </div>
      </div>
      <div className="flex flex-col block md:hidden">
        <h2>
          <a href="/archive">Reviews</a>
        </h2>
        {reviews.map((a) => (
          <ReleaseArticleLink article={a} key={a.id} size="sm" showReviewType />
        ))}
      </div>
    </div>
  );
};

export default Home;
