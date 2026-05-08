import { Release } from "./music";
import { User } from "./users";

export type Article = {
  id: number;
  title: string;
  slug: string;
  release: Release | null;
  published_at: string;
  created_by: User;
  created_at: string;
};

export type Content = {
  id: number;
  content: string;
};

export type ArticleFull = Article & {
  content: Content | null;
};
