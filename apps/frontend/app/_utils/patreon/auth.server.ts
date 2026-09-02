"use server";

import { getQueryString } from "@/_utils/url";

import { KV_DIVIDER } from ".";

const CLIENT_ID = process.env.NEXT_PUBLIC_PATREON_CLIENT_ID;
const SECRET_KEY = process.env.PATREON_SECRET_KEY;
const REFRESH_TOKEN = process.env.PATREON_REFRESH_TOKEN;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_URL}/patreon`;

export const getAuthorizeURL = (redirectTo: string = "/") => {
  if (!CLIENT_ID) throw new Error("No Patreon credentials!");

  const ENDPOINT = "https://www.patreon.com/oauth2/authorize";
  const params = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "identity identity.memberships",
    state: `redirectTo${KV_DIVIDER}${redirectTo}`,
  };
  return `${ENDPOINT}?${getQueryString(params)}`;
};

export const getTokens = async (code: string) => {
  if (!CLIENT_ID || !SECRET_KEY) throw new Error("No Patreon credentials!");

  const ENDPOINT = "https://www.patreon.com/api/oauth2/token";
  const data = {
    code,
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: SECRET_KEY,
    redirect_uri: REDIRECT_URI,
  };
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  });

  if (!response.ok) {
    throw new Error(`Got response ${response.status} from Patreon`);
  }

  const tokens = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: "Bearer";
  };

  return tokens;
};
