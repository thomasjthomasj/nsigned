import { get } from "@/_utils/api.server";
import { postToBsky } from "@/_utils/bsky.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { ReviewRequest } from "@/_types/api";

const THRESHOLD = 10;
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response(
      JSON.stringify({
        posted: false,
        message: "Unauthorized",
      }),
      { status: 401 },
    );
  }

  const reviewRequestsResponse = await get<ReviewRequest[]>({
    endpoint: "music/review-request/pending",
    cacheKey: getCacheKey({
      key: CACHE_KEY.REVIEW_REQUESTS,
    }),
  });

  if (!reviewRequestsResponse.ok) {
    return new Response(
      JSON.stringify({
        posted: false,
        message: reviewRequestsResponse.data.error,
      }),
      { status: 400 },
    );
  }

  const { data: reviewRequests } = reviewRequestsResponse;
  const requestCount = reviewRequests.length;

  if (requestCount < THRESHOLD)
    return new Response(
      JSON.stringify({
        posted: false,
        message: `${requestCount} review request(s) is beneath the threshold of ${THRESHOLD}`,
      }),
    );

  const first = reviewRequests[0].release;
  const message = `Calling all DIY music lovers! There are currently ${requestCount} Bandcamp releases waiting for review on _nsigned!

If you are interested in listening to some new music, head on over to _nsigned to tell us what you think of it!`;

  try {
    await postToBsky({
      text: message,
      hashtags: ["#diymusic", "#musicsky", "#bandcamp"],
      link: "https://nsigned.com/review-requests",
      img: first?.images?.md?.url,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        posted: false,
        message: (e as Error).message,
      }),
      { status: 500 },
    );
  }
}
