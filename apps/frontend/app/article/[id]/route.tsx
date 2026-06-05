import { redirect } from "next/navigation";

import { get } from "@/_utils/api.server";
import { CACHE_KEY, getCacheKey } from "@/_utils/cache";

import type { ArticleFull } from "@/_types/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { data, ok } = await get<ArticleFull>({
    endpoint: `articles/${id}`,
    withAuth: false,
    cacheKey: getCacheKey({
      key: CACHE_KEY.ARTICLE,
      idVal: id,
    }),
  });

  if (!ok) throw new Error("Could not load article");

  redirect(`/article/${data.id}/${data.slug}`);
}
