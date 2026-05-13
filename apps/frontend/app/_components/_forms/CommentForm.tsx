"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { WordCount } from "@/_components/WordCount";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

import type { Comment } from "@/_types/api";

type CommentFormProps = {
  article: { id: number; slug: string };
};

const MAX_WORDS = 300;

export const CommentForm = ({ article }: CommentFormProps) => {
  const [content, setContent] = useState<string>("");
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();

  const refreshIdempotencyKey = useCallback(() => {
    if (!user) return;
    const iso = new Date().toISOString();
    setIdempotencyKey(`ARTICLE-${article.id}:USER-${user.id}:TIME-${iso}`);
  }, [article, user]);

  useEffect(() => {
    refreshIdempotencyKey();
  }, [refreshIdempotencyKey]);

  useEffect(() => {
    setError("");
  }, [content]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const commentResponse = await post<Comment>({
      endpoint: `articles/${article.id}/comment`,
      data: {
        content,
        idempotency_key: idempotencyKey,
      },
    });
    if (!commentResponse.ok) {
      setError(commentResponse.data.error);
    } else {
      const { data: comment } = commentResponse;
      setContent("");
      refreshIdempotencyKey();
      router.refresh();
    }
    setIsSubmitting(false);
  }, [content, idempotencyKey, article, refreshIdempotencyKey]);

  const isDisabled = useMemo(
    () =>
      !user ||
      !idempotencyKey ||
      isSubmitting ||
      content.length === 0 ||
      wordCount > MAX_WORDS,
    [user, idempotencyKey, content, wordCount, isSubmitting],
  );

  if (!user) return null;

  return (
    <div className="w-full flex flex-col gap-[10px]">
      <h4 className="!text-foreground font-bold !not-italic">Post a comment</h4>
      <div className="flex flex-col">
        <FormField
          inputClassName="min-h-[150px]"
          type="textarea"
          name="comment"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder={`Please be civil, and don't write more than ${MAX_WORDS} words!`}
        />
        <WordCount text={content} setWordCount={setWordCount} />
      </div>
      {error && <p>{error}</p>}
      <div>
        <Button onClick={handleSubmit} label="Comment" disabled={isDisabled} />
      </div>
    </div>
  );
};
