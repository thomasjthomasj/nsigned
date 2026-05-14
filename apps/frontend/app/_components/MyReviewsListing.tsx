"use client";

import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";

import { ReviewArchive } from "@/_components/ReviewArchive";

import type { LoggedInUser, Article } from "@/_types/api";

type MyReviewsListingProps = {
  user: LoggedInUser;
  artistArticles: Article[];
  authorArticles: Article[];
};

export const MyReviewsListing = ({
  user,
  artistArticles,
  authorArticles,
}: MyReviewsListingProps) => {
  const [listing, setListing] = useState<"artist" | "author">("artist");

  useEffect(() => {
    if (!artistArticles.length) setListing("author");
  }, [artistArticles]);

  const articles = useMemo(
    () => (listing === "artist" ? artistArticles : authorArticles),
    [listing, artistArticles, authorArticles],
  );

  const queryParams = useMemo(
    () =>
      listing === "artist"
        ? {
            artistUser: user.username,
          }
        : {
            author: user.username,
          },
    [listing, user],
  );

  if (!artistArticles.length && !authorArticles.length)
    return (
      <div className="w-full">
        <p>You don't have any articles yet!</p>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-[20px] pt-[10px]">
      <ul className="flex gap-[50px] !list-none !pl-[10px]">
        {!!artistArticles.length && (
          <li
            className={classNames("py-[5px] px-[10px]", {
              "bg-background-500 underline": listing === "artist",
              "cursor-pointer hover:underline hover:text-primary-100":
                listing !== "artist",
            })}
            onClick={() => setListing("artist")}
          >
            Your coverage
          </li>
        )}
        {!!authorArticles.length && (
          <li
            className={classNames("py-[5px] px-[10px]", {
              "bg-background-500 underline": listing === "author",
              "cursor-pointer hover:underline hover:text-primary-100":
                listing !== "author",
            })}
            onClick={() => setListing("author")}
          >
            Your articles
          </li>
        )}
      </ul>

      <ReviewArchive articles={articles} queryParams={queryParams} />
    </div>
  );
};
