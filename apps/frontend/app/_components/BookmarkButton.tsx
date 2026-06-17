"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/_components/Button";
import { BookmarkIcon } from "@/_components/_icons/BookmarkIcon";
import { useAuth } from "@/_hooks";
import { get, post } from "@/_utils/api.client";

type BookmarkButtonProps = { article: { id: number } };

export const BookmarkButton = ({ article }: BookmarkButtonProps) => {
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const checkIfBookmarked = async () => {
      const bookmarkedIDsResponse = await get<number[]>({
        endpoint: "articles/bookmarks/ids",
        withAuth: true,
      });
      if (!bookmarkedIDsResponse.ok) return;
      setIsBookmarked(bookmarkedIDsResponse.data.includes(article.id));
    };
    checkIfBookmarked();
  }, [user]);

  const handleToggleBookmark = useCallback(async () => {
    if (!user || isBookmarking) return;
    setIsBookmarking(true);
    setIsBookmarked((prev) => !prev);
    await post({
      endpoint: isBookmarked
        ? `articles/${article.id}/bookmark/delete`
        : `articles/${article.id}/bookmark`,
      withAuth: true,
    });
    setIsBookmarking(false);
  }, [user, isBookmarked, isBookmarking]);

  if (!user) return null;

  return (
    <Button
      className="flex items-center"
      onClick={handleToggleBookmark}
      label={
        <>
          <BookmarkIcon bookmarked={isBookmarked} className="pr-[5px]" />
          {isBookmarked ? "Saved" : "Save"}
        </>
      }
    />
  );
};
