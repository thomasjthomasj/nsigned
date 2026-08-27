import type { QueryParams } from "@/_types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getEndpoint = (endpoint: string) => `${API_URL}/${endpoint}`;
