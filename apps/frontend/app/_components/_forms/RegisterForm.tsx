"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/_components/Button";
import { FormField } from "@/_components/FormField";
import { useAuth, useCheckUserExists } from "@/_hooks";
import { post } from "@/_utils/api.client";
import { validateEmail } from "@/_utils/validation";

type Errors = {
  email?: string;
  username?: string;
  displayName?: string;
  password?: string;
  confirmPassword?: string;
};

export const RegisterForm = () => {
  const { user, getUser } = useAuth();

  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors | null>(null);
  const [userEmailExists, setUserEmailExists] = useState<boolean | null>(null);
  const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

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
      if (!password) newErrors.password = REQ;
      if (email && !validateEmail)
        newErrors.email = "Email address is not valid";
      if (!username) newErrors.username = REQ;
      if (!confirmPassword) newErrors.confirmPassword = REQ;
      if (userEmailExists === true)
        newErrors.email = "This email is already registered.";
      if (usernameExists === true)
        newErrors.username = "This username already exists.";
      if (password && password.length < 8)
        newErrors.password = "Password must be at least 8 characters.";
      if (confirmPassword && password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";

      if (Object.values(newErrors).filter(Boolean).length === 0) return null;
      return newErrors;
    });
  }, [
    userEmailExists,
    usernameExists,
    email,
    username,
    password,
    confirmPassword,
  ]);

  const showErrors = useMemo(
    () => email && username && password && confirmPassword,
    [email, username, password, confirmPassword],
  );

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
        password,
        password_confirm: confirmPassword,
      },
      withAuth: false,
    });
    if (!ok) {
      setError(data.error || "There was an issue signing up.");
      return;
    }
    router.refresh();
  }, [email, username, password, confirmPassword, router]);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    await handleRegister();
    await getUser();
    setIsSubmitting(false);
  }, [isValid, handleRegister]);

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
        <FormField
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          value={password}
          type="password"
          error={showErrors ? errors?.password : undefined}
        />
        <FormField
          placeholder="Confirm password"
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          value={confirmPassword}
          error={showErrors ? errors?.confirmPassword : undefined}
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
