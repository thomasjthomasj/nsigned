"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { PencilIcon } from "@/_components/_icons/PencilIcon";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

import type { ArticleFull } from "@/_types/api";

type EditArticleProps = {
  article: ArticleFull;
  containerID: string;
};

export const EditArticle = ({ article, containerID }: EditArticleProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [content, setContent] = useState<string>(article.content?.raw ?? "");
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const container = document.getElementById(containerID);
    if (!container) return;
    if (isEditing) {
      container.style.display = "none";
    } else {
      container.style.display = "";
      setContent(article.content?.raw ?? "");
      setError(null);
    }
  }, [isEditing, containerID, article]);

  const hasPermission = useMemo(() => {
    if (!user) return false;
    if (user.id === article.created_by.id) return true;
    return ["editor", "admin"].includes(user.role);
  }, [article, user]);

  const handleUpdate = useCallback(async () => {
    const { ok } = await post({
      endpoint: `articles/${article.id}/update`,
      data: { content },
    });
    if (!ok) {
      setError("Could not update post.");
      return;
    }
    setIsEditing(false);
    window.location.reload();
  }, [content]);

  if (!user) return false;

  if (!hasPermission) return null;

  if (!isEditing)
    return (
      <div className="flex justify-end items-end w-full">
        <Button
          className="px-[10px]"
          label={<PencilIcon />}
          onClick={() => setIsEditing(true)}
        />
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-[10px]">
      {error && <p className="text-primary-500">{error}</p>}
      <FormField
        inputClassName="min-h-[900px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        name="content"
        type="textarea"
      />
      <div className="flex gap-[10px] justify-between">
        <Button
          label="Cancel"
          onClick={() => setIsEditing(false)}
          className="!bg-background-500 border border-primary-500 hover:!bg-background"
        />
        <Button label="Update" onClick={handleUpdate} />
      </div>
    </div>
  );
};
