import { CommentForm } from "@/_components/_forms/CommentForm";

import { CommentsListing } from "./CommentsListing";

import type { Comment } from "@/_types/api";

type CommentsProps = {
  article: { id: number; slug: string };
  comments: Comment[];
};

export const Comments = ({ article, comments }: CommentsProps) => {
  return (
    <div className="w-full flex flex-col gap-[25px] border-t border-primary-300 py-[25px]">
      <h3>Comments</h3>
      <CommentsListing comments={comments} />
      <CommentForm article={article} />
    </div>
  );
};
