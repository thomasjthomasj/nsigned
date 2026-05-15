"use client";

import { useEffect } from "react";

import { Error as ErrorComponent } from "@/_components/Error";
import { HttpError } from "@/_errors";

type ErrorPageProps = {
  error: (Error | HttpError) & { digest?: string };
};

const ErrorPage = ({ error }: ErrorPageProps) => {
  const { status, message } = (() => {
    try {
      const { status, message } = JSON.parse(error.message);
      return { status, message };
    } catch {
      return { status: 500, message: error.message };
    }
  })()

  const requireLoggedIn = [401, 403].includes(status);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("ERROR CAUGHT", error);
  }, [error]);

  return <ErrorComponent error={message} requireLoggedIn={requireLoggedIn} />;
};

export default ErrorPage;
