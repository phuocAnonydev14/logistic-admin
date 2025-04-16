import HttpService from "@/services/http.service";
import { IGenericResponse } from "@/types/service.type";
import { Session } from "@/types/session";

interface CreateSessionParams {
  user_id?: any;
  anonymous_user_id?: any;
}

interface UpdateSessionParams extends CreateSessionParams {
  session_id: number;
  end_time?: string;
  start_time?: string;
  session_duration?: string;
}

class UserTrackingService extends HttpService {
  /*
    Session api
   */
  async createSession(params: CreateSessionParams) {
    return (
      await this.post<IGenericResponse<Session>, CreateSessionParams>(
        "/session",
        params,
      )
    )?.data;
  }

  async updateSession({ session_id, ...params }: UpdateSessionParams) {
    return (
      await this.put<IGenericResponse<Session>, any>(
        `/session/${session_id}`,
        params,
      )
    )?.data;
  }

  async getSessionByUserId(userId: number) {
    return (
      await this.get<IGenericResponse<Session>>(`/session/user/${userId}`)
    )?.data;
  }

  async getSessionByAnonymousUserId(anonymousUserId: number) {
    return (
      await this.get<IGenericResponse<Session[]>>(`/session`, {
        filter: JSON.stringify({ anonymous: { id: anonymousUserId } }),
      })
    )?.data;
  }

  /*
  Location api
   */
  async addLocation(params: {
    country: number;
    city: string;
    session_id: number;
    device: any;
  }) {
    return (
      await this.post<IGenericResponse<Session>, any>(`/location`, params)
    )?.data;
  }

  async addDevice(params: { device: string; session_id: number }) {
    return (
      await this.post<IGenericResponse<{ id: string }>, any>(
        `/device`,
        { session_id: params.session_id },
        { name: params.device },
      )
    )?.data;
  }

  async addPageView(params: { page_url: string; session_id: number }) {
    return (
      await this.post<IGenericResponse<{ id: string }>, any>(`/page-views`, {
        session_id: params.session_id,
        url: params.page_url,
      })
    )?.data;
  }

  async subscribe({ email }: { email: string }) {
    return (
      await this.post<IGenericResponse<{ id: string }>, any>(`/subscription`, {
        email,
      })
    )?.data;
  }
}

export const userTrackingService = new UserTrackingService();
