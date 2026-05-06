"use client";

import { useCallback, useState } from "react";
import { useCookies } from "react-cookie";

import { Button } from "@/_components/Button";
import { LoginForm } from "@/_components/_forms/LoginForm";
import { RegistrationForm } from "@/_components/_forms/RegistrationForm";
import { useAuth } from "@/_hooks/use-auth";
import { post } from "@/_utils/api.client";
import { COOKIE_NAMES } from "@/_utils/cookies";

export const Profile = () => {
  const [showForm, setShowForm] = useState<null | "login" | "registration">(
    null,
  );
  const { user, getUser, loading } = useAuth();
  const [, , removeCookie] = useCookies([
    COOKIE_NAMES.access,
    COOKIE_NAMES.refresh,
  ]);

  const handleLogOut = useCallback(async () => {
    await post({ endpoint: "users/logout" });
    await getUser();
  }, [removeCookie, getUser]);

  if (loading) return null;
  if (user) return <Button label="Log out" onClick={handleLogOut} />;
  if (showForm)
    return (
      <div className="flex">
        {showForm === "login" && <LoginForm />}
        {showForm === "registration" && <RegistrationForm />}
      </div>
    );

  return (
    <>
      <Button label="Log in" onClick={() => setShowForm("login")} />
      <Button label="Sign up" onClick={() => setShowForm("registration")} />
    </>
  );
};
