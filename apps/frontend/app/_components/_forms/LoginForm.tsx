"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

import { OTPForm } from "./OTPForm";

type Errors = {
  usernameOrEmail?: string;
  password?: string;
};

export const LoginForm = () => {
  const { user } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasRequestedOTP, setHasRequestedOTP] = useState<boolean>(false);
  const [isOtpError, setIsOtpError] = useState<boolean>(false);

  useEffect(() => {
    setErrors(() => {
      const newErrors: Errors = {};
      const REQ = "This field is required.";
      if (!usernameOrEmail) newErrors.usernameOrEmail = REQ;
      if (Object.values(newErrors).filter(Boolean).length === 0) return null;
      return newErrors;
    });
  }, [usernameOrEmail]);

  const isValid = useMemo(() => !errors, [errors]);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    const { ok, data } = await post({
      endpoint: "users/request-otp",
      data: { username_or_email: usernameOrEmail },
    });
    if (ok) {
      setHasRequestedOTP(true);
    } else {
      setIsOtpError(true);
      setError(data.error);
    }
    setIsSubmitting(false);
  }, [isValid, usernameOrEmail]);

  if (user) return null;

  if (isOtpError)
    return (
      <div className="flex flex-col w-full gap-[10px]">
        <p>
          Unfortunately, we could not send you a one-time password. Please come
          back and try again later. If the problem persists, contact me via{" "}
          <a href="https://bsky.app/profile/nsigned.com" target="_blank">
            Bluesky
          </a>{" "}
          or{" "}
          <a href="https://discord.gg/A4hRDQmUYk" target="_blank">
            the Discord
          </a>
          .
        </p>
      </div>
    );

  if (hasRequestedOTP && usernameOrEmail) {
    return <OTPForm usernameOrEmail={usernameOrEmail} />;
  }

  return (
    <form
      className="flex flex-col gap-[15px] max-w-[450px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {error && <p className="text-primary-500">{error}</p>}
      <div className="flex flex-col w-full gap-[10px]">
        <FormField
          placeholder="Username or email"
          name="usernameOrEmail"
          required
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          value={usernameOrEmail ?? ""}
        />
      </div>
      <div>
        <Button
          label="Request password"
          type="submit"
          disabled={!isValid || isSubmitting}
        />
      </div>
    </form>
  );
};
