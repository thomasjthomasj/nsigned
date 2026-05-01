"use client";

import { COOKIE_NAMES } from "@/_utils/cookies";
import type { Error, LoggedInUser, Tokens } from "@/_types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL

type QueryParams = Record<string, string | number | boolean | undefined>;
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

type ErrorResponse = {
  ok: false;
  status: number;
  data: Error;
}

type SuccessResponse<TJson> = {
  ok: true;
  status: number;
  data: TJson;
}

type Response<TJson> = ErrorResponse | SuccessResponse<TJson>;

export const getEndpoint = (endpoint: string) => `${API_URL}/${endpoint}`;

const request = async <TJson>(
  makeRequest: () => Promise<Response<TJson>>, withAuth: boolean
): Promise<Response<TJson>> => {
  const response = await makeRequest();
  if (withAuth && response.status === 401) {
    const tokenResponse = await fetch(getEndpoint("users/refresh"), {
      method: "POST",
      credentials: "include",
    });

    if (tokenResponse.ok) return makeRequest()
  }
  return response;
}

export const get = async <TJson>({ endpoint, withAuth, data }: {
  endpoint: string;
  withAuth?: boolean;
  data?: QueryParams;
}): Promise<Response<TJson>> => {
  const makeRequest = async () => {
    const baseUrl = getEndpoint(endpoint);
    const searchParams = new URLSearchParams();
    for (const [k, v] of Object.entries(data ?? {})) {
      if (v !== undefined) {
        searchParams.append(k, String(v));
      }
    }
    const queryString = searchParams.toString();
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

    const result = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: withAuth ? "include" : "omit",
    })
    return {
      ok: result.ok,
      status: result.status,
      data: await result.json(),
    }
  }

  return request<TJson>(makeRequest, !!withAuth)
}

export const getMe = async () => get<LoggedInUser>({
  endpoint: "users/me",
  withAuth: true,
});

export const post = async <TJson>({
  endpoint,
  data,
  withAuth = true,
}: {
  endpoint: string,
  data: Json,
  withAuth: boolean,
}): Promise<Response<TJson>> => {
  const makeRequest = async () => {
    const result = await fetch(getEndpoint(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: withAuth ? "include" : "omit",
      body: JSON.stringify(data),
    });
    const response = await result.json();
    return {
      ok: result.ok,
      status: result.status,
      data: response,
    }
  }

  return request<TJson>(makeRequest, withAuth);
}
