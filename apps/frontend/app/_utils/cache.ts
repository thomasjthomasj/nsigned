const CACHE_VERSION = 1;
const CACHE_PREFIX = "NSIGNED";

export enum CACHE_KEY {
  ARTICLE = "ARTICLE",
  ARTICLES = "ARTICLES",
  ARTICLE_COMMENTS = "ARTICLE-COMMENTS",
  ARTISTS = "ARTISTS",
  AUTHORS = "AUTHORS",
  RELEASE_DETAILS = "RELEASE-DETAILS",
  REVIEW_REQUEST = "REVIEW-REQUEST",
  REVIEW_REQUESTS = "REVIEW-REQUESTS",
  USER = "USER",
}

const CACHE_PARAMS: Record<CACHE_KEY, string[]> = {
  [CACHE_KEY.ARTICLE]: [],
  [CACHE_KEY.ARTICLES]: [
    "page",
    "page_size",
    "author",
    "artist_user",
    "artist",
    "type",
    "exclude",
  ],
  [CACHE_KEY.AUTHORS]: [],
  [CACHE_KEY.ARTISTS]: [],
  [CACHE_KEY.ARTICLE_COMMENTS]: [],
  [CACHE_KEY.RELEASE_DETAILS]: ["url"],
  [CACHE_KEY.REVIEW_REQUEST]: [],
  [CACHE_KEY.REVIEW_REQUESTS]: [],
  [CACHE_KEY.USER]: [],
};

type GetCacheKeyParams = {
  key: CACHE_KEY;
  idVal?: string | number;
  getData?: Record<string, string | number | null | undefined>;
};
export const getCacheKey = ({
  key,
  idVal,
  getData = {},
}: GetCacheKeyParams) => {
  let cacheKey = `:${CACHE_VERSION}:${CACHE_PREFIX}:${key}${idVal ? `:${idVal}` : ""}`;
  const getParams = CACHE_PARAMS[key];
  getParams.sort((a, b) =>
    String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  for (const param of getParams) {
    const val = getData[param];
    if (val) cacheKey = `${cacheKey}:${param}=${val}`;
  }

  return cacheKey;
};
