import type { Error } from "@/_types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL

type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

type ErrorResponse = {
  ok: false;
  data: Error;
}

type SuccessResponse<TResponseJson> = {
  ok: true;
  data: TResponseJson;
}

export const getEndpoint = (endpoint: string) => `${API_URL}/${endpoint}`;

export const post = async <TResponseJson>(
  endpoint: string,
  data: Json
): Promise<ErrorResponse | SuccessResponse<TResponseJson>> => {
  const result = await fetch(getEndpoint(endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await result.json();
  return {
    ok: result.ok,
    data: response,
  }
}
