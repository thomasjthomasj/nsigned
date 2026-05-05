"use client";

import { useCallback, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

export const LoginForm = () => {
  const { user, getUser } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const isValid = useMemo(() => username && password, [username, password]);

  const handleSubmit = useCallback(async () => {
    setIsLoggingIn(true);
    const { data, ok } = await post({
      endpoint: "users/login",
      data: { username, password },
    });
    if (!ok) {
      setError(data.error);
    }
    await getUser();
    setIsLoggingIn(false);
  }, [username, password]);

  if (user) return null;

  return (
    <div>
      {error && <p className="text-red">{error}</p>}
      <FormField
        label="Username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        required
        value={username}
      />
      <FormField
        label="Password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        required
        value={password}
        type="password"
      />
      <Button
        label="Log in"
        onClick={handleSubmit}
        disabled={!isValid || isLoggingIn}
      />
    </div>
  );
};
