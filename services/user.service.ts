import HttpService from "@/services/http.service";
import { IGenericResponse } from "@/types/service.type";
import { User } from "@/types/app.type";

class UserService extends HttpService {
  async getUser(id: number) {
    return this.get<IGenericResponse<User>>(`/user/${id}`);
  }

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    return this.put<IGenericResponse<User>>(`/user/change-password`, data);
  }
}

export const userService = new UserService();
