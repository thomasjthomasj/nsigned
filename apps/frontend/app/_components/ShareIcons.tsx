"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { BlueskyIcon } from "@/_components/_icons/BlueskyIcon";
import { CopyIcon } from "@/_components/_icons/CopyIcon";
import { FacebookIcon } from "@/_components/_icons/FacebookIcon";
import { PeaceIcon } from "@/_components/_icons/PeaceIcon";
import { RedditIcon } from "@/_components/_icons/RedditIcon";
import { WhatsappIcon } from "@/_components/_icons/WhatsappIcon";

import type { Article } from "@/_types/api";

type ShareIconsProps = {
  article: Article;
};

export const ShareIcons = ({ article }: ShareIconsProps) => {
  const [showPeace, setShowPeace] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const url = useMemo(
    () => `https://nsigned.com/article/${article.id}/${article.slug}`,
    [article],
  );

  const shareText = useMemo(
    () => `Check out this review posted on _nsigned!

${article.title}

${url}
`,
    [article],
  );

  const bskyText = useMemo(
    () => `${shareText}\n#diymusic #musicsky #bandcamp`,
    [shareText],
  );

  const bskyURL = useMemo(
    () =>
      `https://bsky.app/intent/compose?text=${encodeURIComponent(bskyText)}`,
    [shareText, url],
  );

  const redditURL = useMemo(
    () =>
      `https://www.reddit.com/submit?url=${url}&title=${encodeURIComponent(`_nsigned // ${article.title}`)}`,
    [url],
  );

  const facebookURL = useMemo(
    () => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    [url],
  );

  const whatsappURL = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    [url],
  );

  const handleCopy = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      await navigator.clipboard.writeText(shareText);

      setShowPeace(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setShowPeace(false);
        timeoutRef.current = null;
      }, 1000);
    },
    [shareText],
  );

  return (
    <div className="flex items-center gap-[8px]">
      <p className="text-tertiary-500 font-bold text-[20px]">Share</p>
      <div className="flex gap-[5px] text-[22px] -mb-[5px]">
        <a
          href={bskyURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-300"
        >
          <BlueskyIcon />
        </a>
        <a
          href={redditURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-300"
        >
          <RedditIcon />
        </a>
        <a
          href={facebookURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-300"
        >
          <FacebookIcon />
        </a>
        <a
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-300"
        >
          <WhatsappIcon />
        </a>
        {showPeace ? (
          <p className="text-primary-300 cursor-pointer">
            <PeaceIcon /> copied!
          </p>
        ) : (
          <a
            href="#"
            className="text-primary-500 hover:text-primary-300"
            onClick={handleCopy}
          >
            <CopyIcon />
          </a>
        )}
      </div>
    </div>
  );
};
