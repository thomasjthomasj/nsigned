"use client";

import { useEffect } from "react";

import { Error as ErrorComponent } from "@/_components/Error";
import { HttpError } from "@/_errors";

type ErrorPageProps = {
  error: (Error | HttpError) & { digest?: string };
};

const ErrorPage = ({ error }: ErrorPageProps) => {
  const isHttpError = "status" in error;
  const status = isHttpError ? error.status : 500;
  const message =
    (isHttpError && error.message) || "Something somewhere went very wrong.";
  const requireLoggedIn = [401, 403].includes(status);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("ERROR CAUGHT", error);
  }, [error]);

  return <ErrorComponent error={message} requireLoggedIn={requireLoggedIn} />;
};

export default ErrorPage;
