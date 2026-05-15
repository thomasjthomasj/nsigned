import type { ErrorStatus } from "@/_types/api";

export class HttpError extends Error {
  status: ErrorStatus;

  constructor(message: string, status: ErrorStatus) {
    super(message);
    this.status = status;
  }
}
