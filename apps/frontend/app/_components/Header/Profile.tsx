"use client";

import { useState } from "react";

import { LoginForm } from "@/_components/_forms/LoginForm";
import { RegistrationForm } from "@/_components/_forms/RegistrationForm";
import { useAuth } from "@/_hooks/use-auth";

export const Profile = () => {
  const [showForm, setShowForm] = useState<null | "login" | "registration">(
    null,
  );
  const { user } = useAuth();

  if (user) {
    return <p>Hello {user.display_name}</p>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex">
        <a onClick={() => setShowForm("login")}>Login</a>
        <a onClick={() => setShowForm("registration")}>Registration</a>
      </div>
      {showForm !== null && (
        <div className="flex">
          {showForm === "login" && <LoginForm />}
          {showForm === "registration" && <RegistrationForm />}
        </div>
      )}
    </div>
  );
};
