"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { post } from "@/_utils/api.client";

import type { Release } from "@/_types/api";

type CreateArticleProps = {
  release?: Release;
};

const MIN_WORDS = 300;
const MAX_WORDS = 1500;

export const CreateArticle = ({ release }: CreateArticleProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const link = useMemo(() => release?.links[0]?.url ?? undefined, [release]);

  useEffect(() => {
    if (release) {
      setTitle(
        `${release.primary_artist ? `${release.primary_artist.name} - ` : ""}"${release.title}" ${release.release_type} review`,
      );
    }
  }, [release]);

  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content],
  );

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    const result = await post({
      endpoint: "articles/create",
      data: {
        title,
        content: content.trim(),
        ...(link
          ? {
              external_link: link,
            }
          : {}),
      },
    });
    if (result.ok) {
      setHasSubmitted(true);
    }
    setIsLoading(false);
  }, [title, content, link]);

  const disableButton = useMemo(
    () => isLoading || wordCount < MIN_WORDS || wordCount > MAX_WORDS,
    [isLoading, wordCount],
  );

  if (hasSubmitted) {
    return <p>This article has now been published!</p>;
  }

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
      <p>
        {wordCount} word{wordCount === 1 ? "" : "s"}
      </p>
      <div className="flex w-full items-end">
        <Button label="Publish" disabled={disableButton} onClick={handleSave} />
      </div>
    </div>
  );
};
