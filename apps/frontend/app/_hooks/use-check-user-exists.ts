import { useCallback } from "react";

import { useDebounce } from "@/_hooks/use-debounce";
import { get } from "@/_utils/api.client";
import { validateEmail, validateUsername } from "@/_utils/validation";

import type { UserExists } from "@/_types/api";

type UseCheckUserExistsArgs = {
  setError: (error: string) => void;
  setUserExists: (exists: boolean | null) => void;
} & ({ email: string | null } | { username: string | null });

export const useCheckUserExists = (args: UseCheckUserExistsArgs) => {
  const { setError, setUserExists } = args;

  const checkUserExists = useCallback(async () => {
    if ("email" in args) {
      if (!args.email) return;
      if (!validateEmail(args.email)) return;
    }

    if ("username" in args) {
      if (!args.username) return;
      if (!validateUsername(args.username)) return;
    }

    const userExistsResponse = await get<UserExists>({
      endpoint: "users/exists",
      data:
        "email" in args ? { email: args.email! } : { username: args.username! },
    });

    if (!userExistsResponse.ok) {
      setError("Could not verify user exists");
      return;
    }

    setUserExists(userExistsResponse.data.user_exists);
  }, [args]);

  return useDebounce(checkUserExists, 400);
};
