import { headers } from "next/headers";

export function detectLanguage(): {
  lang: "vi" | "en";
  isVie: boolean;
  langPrefix: "_EN" | "_VN";
  pricePrefix: "_USD" | "_VND";
} {
  const headersList = headers();
  const fullUrl = headersList.get("x-your-custom-locale") || "";
  const isVie = fullUrl.includes("/vi");
  const validatedLang = isVie ? "vi" : "en";

  return {
    lang: validatedLang,
    isVie,
    langPrefix: !isVie ? "_EN" : "_VN",
    pricePrefix: !isVie ? "_USD" : "_VND",
  };
}
