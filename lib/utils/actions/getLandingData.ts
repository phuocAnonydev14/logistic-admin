import { landingService } from "@/services/landing.service";
import { detectLanguage } from "@/lib/utils/actions/detectLanguage";

export async function getLandingData<T>(
  fileName: string,
  localData: T,
  isStatic?: boolean,
) {
  const { lang } = detectLanguage();
  try {
    const fetchedData = await landingService.getLandingData<T>(fileName);
    return fetchedData[lang];
  } catch (error) {
    return localData[lang];
  }
}
