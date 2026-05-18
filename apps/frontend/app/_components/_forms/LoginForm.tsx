"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

import { OTPForm } from "./OTPForm";

import type { OTP } from "@/_types/api";

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
  const [hasConsentedEmails, setHasConsentedEmails] = useState<boolean>(false);

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
    const { data, ok } = await post<OTP>({
      endpoint: "users/request-otp",
      data: { username_or_email: usernameOrEmail },
    });
    if (ok) {
      setHasConsentedEmails(data.action === "otp_sent")
      setHasRequestedOTP(true);
    } else {
      setError("There was a problem sending your password.");
    }
    setIsSubmitting(false);
  }, [isValid]);

  if (user) return null;

  if (hasRequestedOTP && usernameOrEmail) {
    return <OTPForm usernameOrEmail={usernameOrEmail} hasConsented={hasConsentedEmails} />;
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
