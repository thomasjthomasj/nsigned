"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

type Errors = {
  usernameOrEmail?: string;
  password?: string;
};

export const LoginForm = () => {
  const { user, getUser } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setErrors(() => {
      const newErrors: Errors = {};
      const REQ = "This field is required.";
      if (!usernameOrEmail) newErrors.usernameOrEmail = REQ;
      if (!password) newErrors.password = REQ;
      if (Object.values(newErrors).filter(Boolean).length === 0) return null;
      return newErrors;
    });
  }, [usernameOrEmail, password]);

  const isValid = useMemo(() => !errors, [errors]);

  const handleLogin = useCallback(async () => {
    const { data, ok } = await post({
      endpoint: "users/login",
      data: { username_or_email: usernameOrEmail, password },
    });
    if (!ok) {
      setError(data.error || "There was an issue logging in.");
      return;
    }
    router.refresh();
  }, [usernameOrEmail, password, router]);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    await handleLogin();
    await getUser();
    setIsSubmitting(false);
  }, [isValid, handleLogin]);

  if (user) return null;

  return (
    <form
      className="flex flex-col gap-[15px] max-w-[450px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {error && <p className="text-red">{error}</p>}
      <div className="flex flex-col w-full gap-[10px]">
        <FormField
          placeholder="Username or email"
          name="usernameOrEmail"
          required
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          value={usernameOrEmail ?? ""}
        />
        <FormField
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          value={password}
          type="password"
        />
      </div>
      <div>
        <Button
          label="Log in"
          type="submit"
          disabled={!isValid || isSubmitting}
        />
      </div>
    </form>
  );
};
