import { cookies } from "next/headers";
import { EToken } from "@/lib/enum/app.enum";
import { redirect } from "@/i18n/routing";

export const validateUser = (checkNotLogin = false) => {
  const accessToken = cookies().get(EToken.ACCESS_TOKEN)?.value;
  const isTokenPresent = !!accessToken;

  if (
    (checkNotLogin && !isTokenPresent) ||
    (!checkNotLogin && isTokenPresent)
  ) {
    redirect("/");
  }
};
