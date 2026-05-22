"use client";

import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth, useCheckUserExists } from "@/_hooks";
import { post } from "@/_utils/api.client";
import { validateEmail, validateUsername } from "@/_utils/validation";

import { OTPForm } from "./OTPForm";

type Errors = {
  email?: string;
  username?: string;
  displayName?: string;
  password?: string;
  confirmPassword?: string;
};

export const RegisterForm = () => {
  const { user } = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [errors, setErrors] = useState<Errors | null>(null);
  const [userEmailExists, setUserEmailExists] = useState<boolean | null>(null);
  const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [hasRequestedOTP, setHasRequestedOTP] = useState<boolean>(false);
  const [isOtpError, setIsOtpError] = useState<boolean>(false);
  const [hasSentConsent, setHasSentConsent] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const checkUserEmailExists = useCheckUserExists({
    setError,
    setUserExists: setUserEmailExists,
    email,
  });

  const checkUsernameExists = useCheckUserExists({
    setError,
    setUserExists: setUsernameExists,
    username,
  });

  useEffect(() => {
    checkUserEmailExists();
  }, [email, checkUserEmailExists]);

  useEffect(() => {
    checkUsernameExists();
  }, [username, checkUsernameExists]);

  useEffect(() => {
    setErrors(() => {
      const newErrors: Errors = {};
      const REQ = "This field is required.";
      if (!email) newErrors.email = REQ;
      if (email && !validateEmail)
        newErrors.email = "Email address is not valid";
      if (!username) newErrors.username = REQ;
      if (userEmailExists === true)
        newErrors.email = "This email is already registered.";
      if (usernameExists === true)
        newErrors.username = "This username already exists.";
      if (!validateUsername(username))
        newErrors.username =
          "Username must consist of only letters, numbers, and hyphens.";

      if (Object.values(newErrors).filter(Boolean).length === 0) return null;
      return newErrors;
    });
  }, [userEmailExists, usernameExists, email, username]);

  const showErrors = useMemo(() => email && username, [email, username]);

  const isValid = useMemo(
    () => !errors && termsAccepted,
    [errors, termsAccepted],
  );

  const handleRegister = useCallback(async () => {
    const { data, ok } = await post({
      endpoint: "users/register",
      data: {
        email,
        username,
      },
      withAuth: false,
    });
    if (!ok) {
      if (data.error === "Could not send OTP") {
        setIsOtpError(true);
        return;
      }
      setError(data.error || "There was an issue signing up.");
      return;
    } else {
      setHasRequestedOTP(true);
    }
    router.refresh();
  }, [email, username, router]);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    await handleRegister();
    setIsSubmitting(false);
  }, [isValid, handleRegister]);

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
                handleRegister();
              }}
            />
          )}
        </div>
      </div>
    );

  if (email && hasRequestedOTP) return <OTPForm usernameOrEmail={email} />;

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
          placeholder="Email"
          name="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email ?? ""}
          type="email"
          error={(showErrors && errors?.email) || undefined}
        />
        <FormField
          placeholder="Username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          required
          value={username}
          error={showErrors ? errors?.username : undefined}
        />
        <p>
          <input
            type="checkbox"
            onChange={() => setTermsAccepted((prev) => !prev)}
            checked={termsAccepted}
            className="mr-[5px]"
          />
          By registering, you are confirming that you agree to the{" "}
          <a href="/terms">terms and conditions</a>.
        </p>
      </div>
      <div>
        <Button
          label="Join"
          type="submit"
          disabled={!isValid || isSubmitting}
        />
      </div>
    </form>
  );
};
