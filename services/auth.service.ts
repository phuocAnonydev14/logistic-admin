import HttpService from "@/services/http.service";
import { User } from "@/types/app.type";
import { IGenericResponse } from "@/types/service.type";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, "password">;
}

class AuthService extends HttpService {
  async login(email: string, password: string) {
    return this.post<IGenericResponse<LoginResponse>, any>("/auth/user/login/admin", {
      email,
      password,
    });
  }

  async register(username: string, password: string, email: string) {
    return this.post("/user", { username, password, email });
  }

  async resetPassword(email: string) {
    return this.post("/auth/user/forget-password", { email });
  }
}

export const authService = new AuthService();
