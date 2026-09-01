"use server";

import { cookies } from "next/headers";

import { getEndpoint } from "@/_utils/api";
import { getQueryString } from "@/_utils/url";
import { getFromCache } from "@/redis";

import type {
  Error,
  ErrorStatus,
  LoggedInUser,
  QueryParams,
  Json,
  Response,
} from "@/_types/api";

type CookieOptions =
  | {
      withAuth: true;
      withCookies?: true;
    }
  | {
      withAuth?: false;
      withCookies?: boolean;
    };

type PostParams = {
  endpoint: string;
  data?: Json;
  withAuth?: boolean;
};

type GetParams = {
  endpoint: string;
  data?: QueryParams;
  withAuth?: boolean;
  cacheKey?: string;
};

const request = async <TJson>(
  makeRequest: (cookie: string) => Promise<Response<TJson>>,
  withAuth: boolean,
  cookie: string = "",
): Promise<Response<TJson>> => {
  const response = await makeRequest(cookie);
  if (withAuth && response.status === 401) {
    const refresh = await fetch(getEndpoint("users/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      cache: "no-store",
    });
    if (refresh.ok) {
      const newCookie = refresh.headers.get("set-cookie");
      if (newCookie) {
        return makeRequest(newCookie);
      }
    }
  }
  return response;
};

export const get = async <TJson = {}>({
  endpoint,
  data,
  withAuth = true,
  cacheKey,
}: GetParams): Promise<Response<TJson>> => {
  const cookieHeader = (await cookies()).toString();

  if (cacheKey) {
    const cachedValue = await getFromCache(cacheKey);
    if (cachedValue) {
      return {
        ok: true,
        data: cachedValue as TJson,
        status: 200,
        cached: true,
      };
    }
  }

  const makeRequest = async (cookie: string): Promise<Response<TJson>> => {
    const baseUrl = getEndpoint(endpoint);
    const queryString = getQueryString(data);
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    const result = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(withAuth ? { Cookie: cookie } : {}),
      },
      cache: "no-store",
    });

    const resultData = await result.json();
    if (result.ok) {
      return {
        ok: true,
        status: result.status,
        data: resultData as TJson,
        cached: false,
      };
    }

    return {
      ok: false,
      status: result.status as ErrorStatus,
      data: resultData as Error,
      cached: false,
    };
  };

  return request<TJson>(makeRequest, withAuth, cookieHeader);
};

export const getMe = async () =>
  get<LoggedInUser>({
    endpoint: "users/me",
    withAuth: true,
  });

export const post = async <TJson = {}>({
  endpoint,
  data,
  withAuth = true,
}: PostParams) => {
  const cookieHeader = (await cookies()).toString();
  const makeRequest = async (cookie: string): Promise<Response<TJson>> => {
    const result = await fetch(getEndpoint(endpoint), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(withAuth ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(data ?? {}),
    });

    const resultData = await result.json();
    if (result.ok) {
      return {
        ok: true,
        status: result.status,
        data: resultData as TJson,
        cached: false,
      };
    }

    return {
      ok: false,
      status: result.status as ErrorStatus,
      data: resultData as Error,
      cached: false,
    };
  };

  return request<TJson>(makeRequest, withAuth, cookieHeader);
};
