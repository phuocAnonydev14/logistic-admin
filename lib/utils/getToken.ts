import { getCookie } from "cookies-next";
import { EToken } from "@/lib/enum/app.enum";

export const getCookieKey = async (key: string) => {
  if (typeof window !== "undefined") {
    return getCookie(EToken.ACCESS_TOKEN);
  }
  const cookieStore = await import("next/headers").then((res) => res.cookies());
  return cookieStore.get(key as any)?.value;
};

export const setCookieKey = async (key: string, value: string) => {
  if (typeof window !== "undefined") {
    return (document.cookie = `${key}=${value}`);
  }
  const cookieStore = await import("next/headers").then((res) => res.cookies());
  return cookieStore.set(key as any, value as any);
};

export const deleteCookieKey = async (key: string) => {
  if (typeof window !== "undefined") {
    return (document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
  }
  const cookieStore = await import("next/headers").then((res) => res.cookies());
  return cookieStore.delete(key as any);
};
