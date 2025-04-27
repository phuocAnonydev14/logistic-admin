import HttpService from "@/services/http.service";
import {Category, Pagination, Product} from "@/types/app.type";
import {IGenericResponse} from "@/types/service.type";

export interface CategoryGetAllFilter {
  limit?: number;
  page?: number;
  order?: { [a: string]: string };
  filter?: Record<keyof Product, string | number | boolean>;
  search?: Record<keyof Product, string | number | boolean>;
}

class CategoryService extends HttpService {
  async getAllCategories(query: CategoryGetAllFilter) {
    return (await this.get<{ data: Category[]; pagination: Pagination }>(
      "/categories",
      query,
      true,
    ))?.data
  }

  async getCategoryDetail(slug: string) {
    return (await this.get<IGenericResponse<Category>>(`/categories/${slug}`, {}, true))?.data
  }
  
  async createCategory(payload: any) {
    return (await this.post<IGenericResponse<Category>>(`/categories`, payload, {}, false))?.data
  }
  
  async updateCategory(id:number,payload: any) {
    return (await this.put<IGenericResponse<Category>>(`/categories/${id}`, payload, {}, false))?.data
  }
  
  async deleteCategory(id: number) {
    return (await this.remove<IGenericResponse<Category>>(`/categories/${id}`, {}, false))?.data
  }
  
  async deleteImage(id: string) {
    return (await this.remove<any>(`/image-upload/${id}`, {}, false))?.data
  }
  
  async addImage(payload: any) {
    return (await this.post<any>(`/image-upload`, payload, {}, false))?.data
  }
}

export const categoryService = new CategoryService();
