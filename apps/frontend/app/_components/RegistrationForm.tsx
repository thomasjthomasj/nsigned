"use client"

import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormField } from "@/_components/FormField";
import { endpoint } from "@/utils/api.client";

const ENDPOINT = endpoint("users/register")

const REQUIRED = ["email", "username", "password", "confirmPassword"] as const;

type Errors = {
  email?: string;
  username?: string;
  displayName?: string;
  password?: string;
  confirmPassword?: string
};

export const RegistrationForm = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errors, setErrors] = useState<Errors | null>(null)

  const data = useMemo(() => ({
    email,
    username,
    displayName,
    password,
    confirmPassword,
  }), [email, username, displayName, password, confirmPassword])

  const showErrors = useMemo(() =>
    REQUIRED.map(f => data[f]).every((v) => v !== null)
  , [data])

  const validate = useCallback(() => {
    const errs: Errors = {};
    for (const field of REQUIRED) {
      if (!data[field]) {
        errs[field] = "This is a required field";
      }
    }
    if (data.password !== data.confirmPassword) {
      errs["confirmPassword"] = "Passwords do not match!";
    }
    setErrors(errs);
  }, [data])

  useEffect(() => {
    validate()
  }, [validate])

  const isValid = useMemo(
    () => !(errors && Object.values(errors).filter(Boolean).length),
    [errors]
  )

  const handleRegister = useCallback(
    async () => {
      if (errors && Object.values(errors).filter(Boolean).length) {
        return false;
      }
    },
    [errors]
  )

  const buttonDisabled = useMemo(() => !isValid || isSubmitting, [isValid, isSubmitting]);

  return (
    <div className="flex flex-col gap-[10px]">
      <FormField
        error={(showErrors && errors?.email) || undefined}
        label="Email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
        value={email ?? ""}
      />
      <FormField
        error={(showErrors && errors?.username) || undefined}
        label="Username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        required
        value={username ?? ""}
      />
      <FormField
        error={(showErrors && errors?.displayName) || undefined}
        label="Display name"
        name="displayName"
        onChange={(e) => setDisplayName(e.target.value)}
        value={displayName ?? ""}
      />
      <FormField
        error={(showErrors && errors?.password) || undefined}
        label="Password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        value={password ?? ""}
      />
      <FormField
        error={(showErrors && errors?.confirmPassword) || undefined}
        label="Confirm password"
        name="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        value={confirmPassword ?? ""}
      />
      <button
        className={classNames(
          "p-[5px] border border-1 border-[#eee]",
          {
            "cursor-pointer": !buttonDisabled,
            "bg-[#eee] text-[#aaa] cursor-not-allowed": buttonDisabled,
          }
        )}
        onClick={handleRegister}
        disabled={buttonDisabled}
      >
        Sign up
      </button>
    </div>
  )
}
