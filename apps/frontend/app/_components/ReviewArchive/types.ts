import { Genre } from "@/_types/api";

export type QueryParams = {
  artist?: string;
  type?: "track" | "album" | "review";
  author?: string;
  artistUser?: string;
  genre?: Genre;
};
