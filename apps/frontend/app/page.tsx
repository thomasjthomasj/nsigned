import { Blog } from "@/_components/Blog";
import { CTABox } from "@/_components/CTABox";
import { FeaturedAuthor } from "@/_components/FeaturedAuthor";
import { RandomReviews } from "@/_components/RandomReviews";
import { ReleaseArticleLink } from "@/_components/ReleaseArticleLink";
import { handleError } from "@/_fns/handle-error";
import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";
import { parseISOLocalTime } from "@/_utils/text";

import type { Article, Author, ErrorResponse } from "@/_types/api";

const Home = async () => {
  const [blogResponse, reviewResponse, featuredAuthorResponse] =
    await Promise.all([
      get<Article[]>({
        endpoint: "articles",
        data: { type: "blog", page_size: 4 },
        withAuth: false,
        cacheKey: getCacheKey({
          key: CACHE_KEY.ARTICLES,
          getData: { type: "blog", page_size: 4 },
        }),
      }),
      get<Article[]>({
        endpoint: "articles",
        data: { type: "review" },
        withAuth: false,
        cacheKey: getCacheKey({
          key: CACHE_KEY.ARTICLES,
          getData: { type: "review" },
        }),
      }),
      get<Author>({
        endpoint: "users/featured-author",
        withAuth: false,
        cacheKey: getCacheKey({
          key: CACHE_KEY.FEATURED_AUTHOR,
        }),
      }),
    ]);

  const handleArticlesError = (r: ErrorResponse) =>
    handleError({
      errorResponse: r,
      message: "The articles didn't load properly, please check back later",
    });
  if (!blogResponse.ok) return handleArticlesError(blogResponse);
  if (!reviewResponse.ok) return handleArticlesError(reviewResponse);

  const { data: blog } = blogResponse;
  const { data: reviews } = reviewResponse;

  const featuredAuthor = featuredAuthorResponse.ok
    ? featuredAuthorResponse.data
    : null;

  const featuredAuthorReviews = await (async () => {
    if (!featuredAuthor) return [];
    const featuredAuthorReviewsResponse = await get<Article[]>({
      endpoint: "articles",
      data: { author: featuredAuthor.username, page_size: 4, type: "review" },
      cacheKey: getCacheKey({
        key: CACHE_KEY.ARTICLES,
        getData: {
          author: featuredAuthor.username,
          page_size: 4,
          type: "review",
        },
      }),
    });
    return featuredAuthorReviewsResponse.ok
      ? featuredAuthorReviewsResponse.data
      : [];
  })();

  const randomExclude = reviews.map((r) => r.id);

  const lastUpdated = reviews[0] ? reviews[0].created_at : null;

  return (
    <div className="w-full flex flex-col gap-[15px]">
      <CTABox />
      <div className="block lg:hidden">
        <Blog title="Announcements" articles={blog.slice(0, 1)} />
        <p className="ml-[10px] mt-[3px]">
          <a href="/blog" className=" text-[14px] !text-primary-300">
            View all
          </a>
        </p>
      </div>
      <div className="grid grid-cols-3 gap-[20px]">
        {!!reviews.length && (
          <div className="flex flex-col col-span-3 lg:col-span-2">
            <h2>
              <a href="/archive">Reviews</a>
            </h2>
            {reviews.map((a) => (
              <ReleaseArticleLink article={a} key={a.id} showReviewType />
            ))}
            <p className="ml-[10px] mt-[3px]">
              <a href="/archive" className=" text-[14px] !text-primary-300">
                View all
              </a>
            </p>
          </div>
        )}
        <div className="flex-col gap-[20px] hidden lg:flex">
          {!!blog.length && (
            <div className="flex flex-col">
              <Blog articles={blog} />
              <p className="mt-[10px]">
                <a href="/blog" className=" text-[14px] !text-primary-300">
                  View all
                </a>
              </p>
            </div>
          )}
          {featuredAuthor && (
            <div className="flex flex-col">
              <FeaturedAuthor
                author={featuredAuthor}
                articles={featuredAuthorReviews}
              />
            </div>
          )}
          <div className="flex flex-col">
            <RandomReviews exclude={randomExclude} />
          </div>
        </div>
      </div>
      {featuredAuthor && (
        <div className="flex flex-col lg:hidden">
          <FeaturedAuthor
            author={featuredAuthor}
            articles={featuredAuthorReviews}
          />
        </div>
      )}
      <div className="flex flex-col lg:hidden">
        <RandomReviews exclude={randomExclude} />
      </div>
      {lastUpdated && (
        <div className="flex justify-end">
          <p className="text-foreground-500 text-[10px] ml-[10px]">
            Last updated{" "}
            <time dateTime={lastUpdated}>{parseISOLocalTime(lastUpdated)}</time>
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
