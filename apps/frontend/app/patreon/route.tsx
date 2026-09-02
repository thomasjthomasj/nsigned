import { redirect } from "next/navigation";

import { post } from "@/_utils/api.server";
import { parseState } from "@/_utils/patreon";

import type { PatreonUser } from "@/_types/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo =
    parseState(searchParams.get("state") ?? "").redirectTo ?? "/";

  const response = await post<PatreonUser>({
    endpoint: "users/connect-patreon",
    data: {
      code,
    },
  });

  if (!response.ok) throw new Error("Could not connect Patreon");

  return redirect(redirectTo);
}
