"use server";

import { HttpError } from "@/_errors";

import type { ErrorStatus, ErrorResponse } from "@/_types/api";

const DEFAULT_MESSAGES: Record<ErrorStatus, string> = {
  400: "Bad request",
  401: "You need to be logged in to do that",
  403: "You don't have access to that",
  404: "Page not found",
  405: "Method not allowed",
  415: "Bad data type",
  500: "Internal server error",
};

type HandleErrorParams = {
  errorResponse?: ErrorResponse;
} & (
  | {
      showMessage?: boolean;
      message?: undefined;
      status?: undefined;
    }
  | {
      showMessage?: false;
      message?: string;
      status?: ErrorStatus;
    }
);

export const handleError = async ({
  errorResponse,
  showMessage,
  message,
  status,
}: HandleErrorParams) => {
  const errorStatus = status ?? errorResponse?.status ?? 500;
  const defaultError =
    DEFAULT_MESSAGES[errorStatus] ?? `Error code ${errorStatus}`;
  const errorMessage =
    (showMessage && errorResponse?.data?.error) || message || defaultError;

  // eslint-disable-next-line no-console
  console.error("ERROR THROWN", errorStatus, errorMessage);
  throw new HttpError(errorMessage, errorStatus);
};
