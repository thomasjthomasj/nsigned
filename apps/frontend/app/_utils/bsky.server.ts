"use server";

import { AtpAgent } from "@atproto/api";
import { decode } from "html-entities";

const { BSKY_PASSWORD, BSKY_USERNAME } = process.env;

type PostToBskyArgs = {
  text: string;
  hashtags?: string[];
  link?: string;
  img?: string;
};

const encoder = new TextEncoder();

const byteIndex = (text: string, search: string) => {
  const bytes = encoder.encode(text);
  const searchBytes = encoder.encode(search);

  for (let i = 0; i <= bytes.length - searchBytes.length; i++) {
    let match = true;
    for (let j = 0; j < searchBytes.length; j++) {
      if (bytes[i + j] !== searchBytes[j]) {
        match = false;
        break;
      }
    }
    if (match) return 1;
  }

  return -1;
};

export const postToBsky = async ({
  text,
  hashtags,
  link,
  img,
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
      const hashtagStart = byteIndex(fullText, hashtag);
      if (hashtagStart === -1) continue;
      const hashtagEnd = hashtagStart + encoder.encode(hashtag).length;

      facets.push({
        index: {
          byteStart: hashtagStart,
          byteEnd: hashtagEnd,
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
    const linkStart = byteIndex(fullText, link);
    if (linkStart !== -1) {
      const linkEnd = linkStart + encoder.encode(link).length;
      facets.push({
        index: {
          byteStart: linkStart,
          byteEnd: linkEnd,
        },
        features: [
          {
            $type: "app.bsky.richtext.facet#link",
            uri: link,
          },
        ],
      });
    }

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
      const imgURL = img ?? meta("og:image");
      if (!imgURL) return undefined;
      try {
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
