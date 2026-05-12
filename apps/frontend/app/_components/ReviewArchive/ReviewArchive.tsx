import { Listing } from "./Listing";
import { Paginator } from "./Paginator";

import type { QueryParams } from "./types";
import type { Article } from "@/_types/api";

type ReviewArchiveProps = {
  articles: Article[];
  queryParams?: QueryParams;
};

export const ReviewArchive = ({ articles }: ReviewArchiveProps) => (
  <div className="w-full flex flex-col">
    <Listing articles={articles} />
    <Paginator />
  </div>
);
