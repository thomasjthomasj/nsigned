import type { QueryParams } from "@/_types";

export const getQueryString = (data: QueryParams = {}) => {
  const searchParams = new URLSearchParams();
  for (const [k, v] of Object.entries(data ?? {})) {
    if (v !== undefined) {
      searchParams.append(k, String(v));
    }
  }
  return searchParams.toString();
};
