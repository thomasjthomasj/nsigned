"use server";

import { cookies } from "next/headers";

import { getEndpoint, getQueryString } from "@/_utils/api";

import type { LoggedInUser, QueryParams, Response } from "@/_types/api";

type GetParams = {
  endpoint: string;
  data?: QueryParams;
  withAuth?: boolean;
};

export const get = async <TJson = {}>({
  endpoint,
  data,
  withAuth = true,
}: GetParams): Promise<Response<TJson>> => {
  const cookieHeader = (await cookies()).toString();
  const makeRequest = async (cookie: string) => {
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

    return {
      ok: result.ok,
      status: result.status,
      data: await result.json(),
    };
  };

  const response = await makeRequest(cookieHeader);
  if (withAuth && response.status === 401) {
    const refresh = await fetch(getEndpoint("users/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
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

export const getMe = async () =>
  get<LoggedInUser>({
    endpoint: "users/me",
    withAuth: true,
  });
