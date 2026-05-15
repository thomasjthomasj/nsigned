import type { ErrorStatus } from "@/_types/api";

export class HttpError extends Error {
  constructor(message: string, status: ErrorStatus) {
    super(JSON.stringify({
      message,
      status,
    }));
  }
}
