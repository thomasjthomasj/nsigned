"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { WordCount } from "@/_components/WordCount";
import { post } from "@/_utils/api.client";
import { getWordCount } from "@/_utils/text";

import type { Article, ReviewRequest } from "@/_types/api";

type CreateArticleProps = {
  reviewRequest?: ReviewRequest;
};

const MIN_WORDS = 300;
const MAX_WORDS = 1500;

export const CreateArticle = ({ reviewRequest }: CreateArticleProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const router = useRouter();

  const release = useMemo(() => reviewRequest?.release, [reviewRequest]);

  useEffect(() => {
    if (release) {
      setTitle(
        `${release.primary_artist ? `${release.primary_artist.name} - ` : ""}"${release.title}" ${release.release_type} review`,
      );
    }
  }, [release]);

  const handleSave = useCallback(async () => {
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
      router.push(`/article/${article.id}/${article.slug}`);
    }
    setIsLoading(false);
  }, [title, content, reviewRequest]);

  const disableButton = useMemo(
    () => isLoading || wordCount < MIN_WORDS || wordCount > MAX_WORDS,
    [isLoading, wordCount],
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
        placeholder={`Keep your review between ${MIN_WORDS} and ${MAX_WORDS} words`}
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
