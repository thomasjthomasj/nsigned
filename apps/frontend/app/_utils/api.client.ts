"use client";

import type { Error, LoggedInUser } from "@/_types/api";

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

type CookieOptions = {
  withAuth: true;
  withCookies?: true
} | {
  withAuth?: false;
  withCookies?: boolean;
}

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

export const get = async <TJson = {}>({
  endpoint,
  data,
  withAuth = true,
  withCookies = true,
}: {
  endpoint: string;
  data?: QueryParams;
} & CookieOptions): Promise<Response<TJson>> => {
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
      credentials: withCookies ? "include" : "omit",
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

export const post = async <TJson = {}>({
  endpoint,
  data,
  withAuth = true,
  withCookies = true,
}: {
  endpoint: string,
  data: Json,
} & CookieOptions): Promise<Response<TJson>> => {
  const makeRequest = async () => {
    const result = await fetch(getEndpoint(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: withCookies ? "include" : "omit",
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
