"use server";

import { AtpAgent } from "@atproto/api";
import { decode } from "html-entities";

const { BSKY_PASSWORD, BSKY_USERNAME } = process.env;

type PostToBskyArgs = {
  text: string;
  hashtags?: string[];
  link?: string;
  imgFallback?: string;
};

export const postToBsky = async ({
  text,
  hashtags,
  link,
  imgFallback,
}: PostToBskyArgs) => {
  if (!BSKY_PASSWORD || !BSKY_USERNAME)
    throw new Error("Bluesky credentials are missing");

  const agent = new AtpAgent({ service: "https://bsky.social" });

  await agent.login({
    identifier: BSKY_USERNAME,
    password: BSKY_PASSWORD,
  });

  const fullText = `${text}\n${hashtags ? `\n${hashtags.join(" ")}\n` : ""}${link ? `\n${link}` : ""}`;

  const facets: any[] = [];

  let embed: any;

  if (hashtags) {
    for (const hashtag of hashtags) {
      facets.push({
        index: {
          byteStart: fullText.indexOf(hashtag),
          byteEnd: fullText.indexOf(hashtag) + hashtag.length,
        },
        features: [
          {
            $type: "app.bsky.richtext.facet#tag",
            tag: hashtag.replace("#", ""),
          },
        ],
      });
    }
  }

  if (link) {
    facets.push({
      index: {
        byteStart: fullText.indexOf(link),
        byteEnd: fullText.indexOf(link) + link.length,
      },
      features: [
        {
          $type: "app.bsky.richtext.facet#link",
          uri: link,
        },
      ],
    });

    const response = await fetch(link);
    const html = await response.text();
    const meta = (property: string) => {
      const pattern = new RegExp(
        `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i",
      );
      const match = html.match(pattern);
      return match?.[1] ? decode(match[1]) : undefined;
    };

    const thumb = await (async () => {
      const imgURL = meta("og:image");
      if (!imgURL) return undefined;
      try {
        const buffer = await (async () => {
          try {
            const imgResponse = await fetch(imgURL);
            const arrayBuffer = await imgResponse.arrayBuffer();
            if (arrayBuffer.byteLength > 1000000)
              throw new Error("Upload too large, use fallback instead.");
            return arrayBuffer;
          } catch {
            if (!imgFallback) return undefined;
            const imgResponse = await fetch(imgFallback);
            const arrayBuffer = await imgResponse.arrayBuffer();
            if (arrayBuffer.byteLength > 1000000) return undefined;
            return arrayBuffer;
          }
        })();

        const imgResponse = await fetch(imgURL);
        const arrayBuffer = await imgResponse.arrayBuffer();
        if (arrayBuffer.byteLength > 1000000) return undefined;

        const upload = await agent.uploadBlob(new Uint8Array(arrayBuffer), {
          encoding: imgResponse.headers.get("content-type") || "image/jpeg",
        });

        return upload.data.blob;
      } catch {
        return undefined;
      }
    })();

    embed = {
      $type: "app.bsky.embed.external",
      external: {
        uri: link,
        title: meta("og:title"),
        description: meta("og:description"),
        thumb,
      },
    };
  }

  await agent.post({
    text: fullText,
    facets,
    embed,
  });
};
