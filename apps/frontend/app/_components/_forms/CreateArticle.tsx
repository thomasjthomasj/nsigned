"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { WordCount } from "@/_components/WordCount";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";
import { postToBsky } from "@/_utils/bsky.server";
import { genres } from "@/_utils/genre";

import type { Article, Genre, ReviewRequest } from "@/_types/api";

type CreateArticleProps = {
  reviewRequest?: ReviewRequest;
};

const MIN_WORDS = 200;
const MAX_WORDS = 1500;

export const CreateArticle = ({ reviewRequest }: CreateArticleProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [genre, setGenre] = useState<Genre | null>(null);
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
      setGenre(release.genre);
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
              genre,
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
  }, [user, title, content, reviewRequest, genre]);

  const missingGenre = useMemo(() => release && !genre, [release, genre]);

  const disableButton = useMemo(
    () =>
      !user ||
      isLoading ||
      wordCount < MIN_WORDS ||
      wordCount > MAX_WORDS ||
      missingGenre,
    [user, isLoading, wordCount, missingGenre],
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
      {release && (
        <div className="flex flex-col mb-[15px]">
          <label className="font-bold" htmlFor="genre">
            Which of these most closely describes the music?
          </label>
          <select
            className={"bg-background-500 p-[8px]"}
            name="genre"
            id="genre"
            value={genre ?? ""}
            onChange={(e) => setGenre(e.target.value as Genre)}
          >
            <option value="" disabled>
              Select...
            </option>
            {Object.entries(genres).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex w-full items-end">
        <Button label="Publish" disabled={disableButton} onClick={handleSave} />
      </div>
    </div>
  );
};
