import type { QueryParams } from "@/_types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getEndpoint = (endpoint: string) => `${API_URL}/${endpoint}`;

export const getQueryString = (data: QueryParams = {}) => {
  const searchParams = new URLSearchParams();
  for (const [k, v] of Object.entries(data ?? {})) {
    if (v !== undefined) {
      searchParams.append(k, String(v));
    }
  }
  return searchParams.toString();
};
