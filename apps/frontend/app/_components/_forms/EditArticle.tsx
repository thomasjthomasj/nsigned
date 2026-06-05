"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { BlueskyIcon } from "@/_components/_icons/BlueskyIcon";
import { PencilIcon } from "@/_components/_icons/PencilIcon";
import { RefreshIcon } from "@/_components/_icons/RefreshIcon";
import { TrashIcon } from "@/_components/_icons/TrashIcon";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";
import { postToBsky } from "@/_utils/bsky.server";

import type { ArticleFull } from "@/_types/api";

type EditArticleProps = {
  article: ArticleFull;
  containerID: string;
};

export const EditArticle = ({ article, containerID }: EditArticleProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const [isPostingToBsky, setIsPostingToBsky] = useState<boolean>(false);
  const [content, setContent] = useState<string>(article.content?.raw ?? "");
  const [deleteReason, setDeleteReason] = useState<string>("");
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

  const hasEditPermission = useMemo(() => {
    if (!user) return false;
    if (user.id === article.created_by.id) return true;
    return ["editor", "admin"].includes(user.role);
  }, [article, user]);

  const hasDeletePermission = useMemo(() => {
    if (!user) return false;
    return user.role === "admin";
  }, [user]);

  const hasRevalidatePermission = useMemo(() => {
    if (!user) return false;
    return ["editor", "admin"].includes(user.role);
  }, [user]);

  const hasBskyPermission = useMemo(() => {
    if (!user) return false;
    return user.role === "admin";
  }, [user]);

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
  }, [content, article]);

  const handleDelete = useCallback(async () => {
    const { data, ok } = await post({
      endpoint: `articles/${article.id}/delete`,
      data: { reason: deleteReason },
    });
    if (!ok) {
      setError(data.error);
      return;
    }
    setIsDeleting(false);
    window.location.reload();
  }, [deleteReason, article]);

  const handleRevalidate = useCallback(async () => {
    setIsRevalidating(true);
    const { ok, data } = await post({
      endpoint: `articles/${article.id}/revalidate`,
    });
    setIsRevalidating(false);
    if (!ok) {
      setError(data.error);
      return;
    }
    window.location.reload();
  }, [article]);

  const handlePostToBsky = useCallback(async () => {
    setIsPostingToBsky(true);
    await postToBsky({
      text: `${article.title} by ${article.created_by.display_name}\n\nRead it on _nsigned!`,
      link: `https://nsigned.com/article/${article.id}`,
      hashtags: ["#diymusic", "#bandcamp"],
    });
    setIsPostingToBsky(false);
  }, [article]);

  if (!user) return false;

  if (!hasEditPermission) return null;

  if (!isEditing && !isDeleting)
    return (
      <div className="flex justify-end items-end w-full gap-[10px]">
        <Button
          className="px-[10px]"
          label={<PencilIcon />}
          onClick={() => setIsEditing(true)}
        />
        {hasRevalidatePermission && (
          <Button
            className="px-[10px]"
            label={<RefreshIcon />}
            onClick={handleRevalidate}
            disabled={isRevalidating}
          />
        )}
        {hasBskyPermission && (
          <Button
            className="px-[10px]"
            label={<BlueskyIcon />}
            onClick={handlePostToBsky}
            disabled={isPostingToBsky}
          />
        )}
        {hasDeletePermission && (
          <Button
            className="px-[10px]"
            label={<TrashIcon />}
            onClick={() => setIsDeleting(true)}
          />
        )}
      </div>
    );

  if (isDeleting)
    return (
      <div className="w-full flex flex-col gap-[10px] mt-[20px]">
        {error && <p className="text-primary-500">{error}</p>}
        <FormField
          inputClassName="min-h-[100px]"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          name="delete-reason"
          type="textarea"
          placeholder="Reason for deleting"
        />
        <div className="flex gap-[10px] justify-between">
          <Button
            label="Cancel"
            onClick={() => setIsDeleting(false)}
            className="!bg-background-500 border border-primary-500 hover:!bg-background"
          />
          <Button label="Delete" onClick={handleDelete} />
        </div>
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
