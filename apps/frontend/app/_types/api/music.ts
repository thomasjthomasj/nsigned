import { Article } from "./articles";
import { Link } from "./links";
import { User } from "./users";

type Image = {
  url: string;
  height: number;
  width: number;
};

export type Images = {
  sm: Image;
  md: Image;
  lg: Image;
};

export type ReleaseType = "track" | "album";

export type ReleaseDetails = {
  artist_name: string;
  title: string;
  label: string | null;
  images: Images;
  release_type: ReleaseType;
  link: string;
};

export type Artist = {
  id: number;
  name: string;
  slug: string;
};

export type Label = {
  id: number;
  name: string;
  slug: string;
};

export type Release = {
  id: number;
  title: string;
  slug: string;
  primary_artist: Artist;
  label: Label | null;
  links: Link[];
  images: Images;
  release_type: ReleaseType;
};

export type ReviewRequest = {
  id: number;
  release: Release;
  created_at: string;
  created_by: User;
  article: Article | null;
};
