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
  const [hasSentConsent, setHasSentConsent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

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
      setEmail(data.error);
    }
    setIsSubmitting(false);
  }, [isValid, usernameOrEmail]);

  const handleSendConsent = useCallback(async () => {
    const { ok } = await post({
      endpoint: "users/send-email-consent",
      data: { email },
    });
    if (!ok) {
      setError(
        "There was an issue sending your consent email, please try again later.",
      );
      return;
    }
    setHasSentConsent(true);
  }, [email]);

  if (user) return null;

  if (isOtpError)
    return (
      <div className="flex flex-col w-full gap-[10px]">
        <p>
          Unfortunately, the email service we use could not send you a one-time
          password until you consent to receiving emails. Please click the
          button below to send a consent email. Once you have confirmed your
          consent, <a href="/login">log in</a> with the username or email
          provided.
        </p>
        <div className="flex gap-[10px]">
          <Button
            label="Send consent email"
            onClick={handleSendConsent}
            disabled={hasSentConsent}
          />
          {hasSentConsent && (
            <Button
              label="I have received the consent email and clicked 'Approve'"
              onClick={() => {
                setIsOtpError(false);
                setHasSentConsent(false);
                handleSubmit();
              }}
            />
          )}
        </div>
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
