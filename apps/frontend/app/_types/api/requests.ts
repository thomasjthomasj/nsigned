import { Error, ErrorStatus } from "./error";

export type QueryParams = Record<string, string | number | boolean | undefined>;
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type ErrorResponse = {
  ok: false;
  status: ErrorStatus;
  data: Error;
};

export type SuccessResponse<TJson> = {
  ok: true;
  status: number | ErrorStatus;
  data: TJson;
};

export type Response<TJson> = ErrorResponse | SuccessResponse<TJson>;
