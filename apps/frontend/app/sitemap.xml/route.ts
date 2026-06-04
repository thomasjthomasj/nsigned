import { NextResponse } from "next/server";

import { get } from "@/_utils/api.server";

import type { ArticleMeta, UserMeta } from "@/_types/api";

export async function GET() {
  const [articleResponse, userResponse] = await Promise.all([
    get<ArticleMeta[]>({
      endpoint: "articles/sitemap",
      cacheKey: "ARTICLES:SITEMAP",
      withAuth: false,
    }),
    get<UserMeta[]>({
      endpoint: "users/sitemap",
      cacheKey: "USERS:SITEMAP",
      withAuth: false,
    }),
  ]);

  if (!articleResponse.ok || !userResponse.ok)
    throw new Error("Could not load sitemap");
  const { data: articles } = articleResponse;
  const { data: users } = userResponse;

  const [first] = articles;
  const isoDate = (date: string) => date.split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nsigned.com/</loc>
    <lastmod>${isoDate(first.published_at)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nsigned.com/archive</loc>
    <lastmod>${isoDate(first.published_at)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://nsigned.com/join</loc>
    <priority>0.2</priority>
  </url>
  <url>
    <loc>https://nsigned.com/login</loc>
    <priority>0.1</priority>
  </url>
  <url>
    <loc>https://nsigned.com/review-requests</loc>
    <changefreq>daily</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://nsigned.com/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nsigned.com/ai-policy</loc>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://nsigned.com/editorial-guide</loc>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://nsigned.com/faq</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://nsigned.com/terms</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://nsigned.com/writers</loc>
    <priority>0.2</priority>
  </url>
  <url>
    <loc>https://nsigned.com/artists</loc>
    <priority>0.2</priority>
  </url>
  ${articles.map(
    (a) => `
    <url>
      <loc>https://nsigned.com/article/${a.id}/${a.slug}</loc>
      <lastmod>${isoDate(a.published_at)}</lastmod>
      <priority>0.9</priority>
    </url>
  `,
  )}
  ${users.map(
    (u) => `
    <url>
      <loc>https://nsigned.com/profile/${u.username}</loc>
      <priority>0.7</priority>
    </url>
  `,
  )}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
