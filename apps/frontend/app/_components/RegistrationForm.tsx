"use client"

import { useCallback, useState } from "react";
import { FormField } from "@/_components/FormField";
import { endpoint } from "@/utils/api.client";

const ENDPOINT = endpoint("users/register")

export const RegistrationForm = () => {
  const [email, setEmail] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [displayName, setDisplayName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const handleSave = useCallback(
    () => {},
    [email, username, displayName, password, confirmPassword]
  )

  return (
    <div className="flex flex-col gap-[10px]">
      <FormField
        label="Email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        required
        type="email"
        value={email}
      />
      <FormField
        label="Username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        required
        value={username}
      />
      <FormField
        label="Display name"
        name="displayName"
        onChange={(e) => setDisplayName(e.target.value)}
        value={displayName}
      />
      <FormField
        label="Password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        value={password}
      />
      <FormField
        label="Confirm password"
        name="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="confirmPassword"
        value={confirmPassword}
      />
      <button
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  )
}
