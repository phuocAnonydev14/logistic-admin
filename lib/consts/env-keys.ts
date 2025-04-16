import * as process from "process";

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "";
export const SMTP_SERVER_USERNAME =
  process.env.NEXT_PUBLIC_SMTP_SERVER_USERNAME || "";
export const SMTP_SERVER_PASSWORD =
  process.env.NEXT_PUBLIC_SMTP_SERVER_PASSWORD || "";

export const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
