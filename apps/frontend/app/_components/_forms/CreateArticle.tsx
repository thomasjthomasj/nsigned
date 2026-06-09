"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { WordCount } from "@/_components/WordCount";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";
import { postToBsky } from "@/_utils/bsky.server";

import type { Article, ReviewRequest } from "@/_types/api";

type CreateArticleProps = {
  reviewRequest?: ReviewRequest;
};

const MIN_WORDS = 200;
const MAX_WORDS = 1500;

export const CreateArticle = ({ reviewRequest }: CreateArticleProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const router = useRouter();

  const release = useMemo(() => reviewRequest?.release, [reviewRequest]);

  const { user } = useAuth();

  useEffect(() => {
    if (release) {
      setTitle(
        `${release.primary_artist ? `${release.primary_artist.name} - ` : ""}"${release.title}" ${release.release_type} review`,
      );
    }
  }, [release]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const result = await post<Article>({
      endpoint: "articles/create",
      data: {
        title,
        content: content.trim(),
        ...(reviewRequest
          ? {
              review_request: reviewRequest.id,
            }
          : {}),
      },
    });
    if (result.ok) {
      const { data: article } = result;

      postToBsky({
        text: `New review!\n\n${title} by ${user.display_name}`,
        link: `https://nsigned.com/article/${article.id}`,
        hashtags: ["#diymusic", "#musicsky", "#bandcamp"],
        img: article?.release?.images?.md?.url,
      });
      router.push(`/article/${article.id}/${article.slug}`);
    } else {
      setIsLoading(false);
    }
  }, [user, title, content, reviewRequest]);

  const disableButton = useMemo(
    () => !user || isLoading || wordCount < MIN_WORDS || wordCount > MAX_WORDS,
    [user, isLoading, wordCount],
  );

  return (
    <div className="flex flex-col gap-[10px]">
      {!release && (
        <FormField
          label="Title"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      )}
      <FormField
        className="w-full"
        inputClassName="w-full h-[500px]"
        name="content"
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Keep your review between ${MIN_WORDS} and ${MAX_WORDS} words.

Formatting help:

 **bold**
 *italics*
 > quote
 - list
 1. numbered list
`}
        value={content}
        type="textarea"
      />
      <WordCount text={content} setWordCount={setWordCount} />
      <div className="flex w-full items-end">
        <Button label="Publish" disabled={disableButton} onClick={handleSave} />
      </div>
    </div>
  );
};
