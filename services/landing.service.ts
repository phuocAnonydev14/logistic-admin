import HttpService from "@/services/http.service";
import { IGenericResponse } from "@/types/service.type";

class LandingService extends HttpService {
  constructor() {
    super(process.env.NEXT_PUBLIC_BASE_URL || "");
  }
  async getLandingData<T>(page: string) {
    return (
      await this.get<IGenericResponse<T>>(
        `/page/${page.split(".")[0]}`,
        {},
        true,
      )
    ).data;
  }
}

export const landingService = new LandingService();
