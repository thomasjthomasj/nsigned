export type QueryParams = Record<string, string | number | boolean | undefined>;

export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type PlayState = "playing" | "paused" | "loading";
