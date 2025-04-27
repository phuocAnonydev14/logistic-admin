import HttpService from "@/services/http.service";
import { Pagination, Product} from "@/types/app.type";
import {RecruitmentType} from "@/types/recruitment.type";

export interface RecruitmentGetAllFilter {
  limit?: number;
  page?: number;
  order?: { [a: string]: string };
  filter?: Record<keyof Product, string | number | boolean>;
  search?: Record<keyof Product, string | number | boolean>;
}

class RecruitmentService extends HttpService {
// async function to get all categories
  async getAllRecruitment(query: RecruitmentGetAllFilter) {
    // return the data from the recruitment endpoint
    return (await this.get<{ data: RecruitmentType[]; pagination: Pagination }>(
      "/recruitment",
      query,
      true,
    ))?.data
  }
  
  async getRecruitmentDetail(slug: string) {
    return (await this.get<any>(`/recruitment/${slug}`, {}, true))?.data
  }
  
  async createRecruitment(payload: any) {
    return (await this.post<any>(`/recruitment`, payload, {}, false))?.data
  }
  
  async updateRecruitment(id: number, payload: any) {
    return (await this.put<any>(`/recruitment/${id}`, payload, {}, false))?.data
  }
  
  async deleteRecruitment(id: number) {
    return (await this.remove<any>(`/recruitment/${id}`, {}, false))?.data
  }
}

export const recruitmentService = new RecruitmentService();
