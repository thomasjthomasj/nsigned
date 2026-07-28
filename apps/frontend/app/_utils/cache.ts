const CACHE_VERSION = 1;
const CACHE_PREFIX = "NSIGNED";

export enum CACHE_KEY {
  ARTICLE = "ARTICLE",
  ARTICLES = "ARTICLES",
  ARTICLES_RANDOM = "ARTICLES:RANDOM",
  ARTICLE_COMMENTS = "ARTICLE-COMMENTS",
  ARTISTS = "ARTISTS",
  AUTHORS = "AUTHORS",
  BOOKMARKS = "BOOKMARKS",
  BOOKMARK_IDS = "BOOKMARK_IDS",
  FEATURED_AUTHOR = "FEATURED_AUTHOR",
  RELEASE = "RELEASE",
  RELEASE_DETAILS = "RELEASE-DETAILS",
  REVIEW_REQUEST = "REVIEW-REQUEST",
  REVIEW_REQUEST_COUNT = "REVIEW-REQUEST-COUNT",
  REVIEW_REQUESTS = "REVIEW-REQUESTS",
  TRACKS = "TRACKS",
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
    "genre",
  ],
  [CACHE_KEY.ARTICLES_RANDOM]: ["exclude"],
  [CACHE_KEY.AUTHORS]: [],
  [CACHE_KEY.ARTISTS]: [],
  [CACHE_KEY.ARTICLE_COMMENTS]: [],
  [CACHE_KEY.BOOKMARKS]: [],
  [CACHE_KEY.BOOKMARK_IDS]: [],
  [CACHE_KEY.FEATURED_AUTHOR]: [],
  [CACHE_KEY.RELEASE]: [],
  [CACHE_KEY.RELEASE_DETAILS]: ["url"],
  [CACHE_KEY.REVIEW_REQUEST]: [],
  [CACHE_KEY.REVIEW_REQUEST_COUNT]: [],
  [CACHE_KEY.REVIEW_REQUESTS]: [],
  [CACHE_KEY.TRACKS]: [],
  [CACHE_KEY.USER]: [],
};

type GetCacheKeyParams = {
  key: CACHE_KEY;
  idVal?: string | number;
  getData?: Record<string, string | number | null | undefined>;
  userID?: number;
};
export const getCacheKey = ({
  key,
  idVal,
  getData = {},
  userID,
}: GetCacheKeyParams) => {
  let cacheKey = `:${CACHE_VERSION}:${CACHE_PREFIX}:${key}${idVal ? `:${idVal}` : ""}${userID ? `:USER-${userID}` : ""}`;
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
