"use client";

import { useEffect } from "react";

import { Error as ErrorComponent } from "@/_components/Error";

type ErrorPageProps = {
  error: Error & { digest?: string };
};

const ErrorPage = ({ error }: ErrorPageProps) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("ERROR CAUGHT", error, error.digest);
  }, [error]);

  return <ErrorComponent error={error.message} />;
};

export default ErrorPage;
