"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth } from "@/_hooks";
import { post } from "@/_utils/api.client";

type OTPFormProps = {
  usernameOrEmail: string;
  hasConsented: boolean;
};

export const OTPForm = ({ usernameOrEmail, hasConsented }: OTPFormProps) => {
  const { user, getUser } = useAuth();
  const [otp, setOTP] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [autoSubmit, setAutoSubmit] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const { ok } = await post({
      endpoint: "users/login",
      data: { username_or_email: usernameOrEmail, password: otp },
    });
    if (!ok) {
      setError(
        "There was an issue logging in. Please check your password and try again.",
      );
      setAutoSubmit(false);
      setIsSubmitting(false);
    } else {
      router.refresh();
    }
    await getUser();
  }, [usernameOrEmail, otp, router, getUser]);

  useEffect(() => {
    if (isSubmitting || !autoSubmit || otp.length !== 6) return;
    handleSubmit();
  }, [otp, usernameOrEmail, isSubmitting, autoSubmit, handleSubmit]);

  const isValid = useMemo(() => otp.length === 6 && !isSubmitting, [otp]);

  if (user) return null;

  return (
    <div className="flex flex-col gap-[10px]">
      {hasConsented && <p>
        Thank you! A single-use password has been sent to your email.
      </p>}
      {!hasConsented && <p>
        Before receiving your single-use password, you will be sent an email to confirm
        that you are happy to receive emails from _nsigned. The <strong>only</strong> emails
        this site will send you beyond this are single-use passwords, but if you do not consent
        then you will be unable to log in.
      </p>}
      <p>Please check your spam folder if it doesn't arrive.</p>
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
            placeholder="Single use password"
            name="password"
            onChange={(e) => setOTP(e.target.value)}
            required
            value={otp}
            type="password"
          />
        </div>
        {!autoSubmit && (
          <div>
            <Button
              label="Log in"
              type="submit"
              disabled={!isValid}
            />
          </div>
        )}
      </form>
    </div>
  );
};
