import HttpService from "@/services/http.service";
import {
  IGenericResponse,
  IGenericResponsePagination,
} from "@/types/service.type";
import { BlogType } from "@/types/blog.type";
import {Category, GetAllFilter, Pagination} from "@/types/app.type";

class BlogService extends HttpService {
  async getAllBlogs(query: GetAllFilter) {
    return (await this.get<IGenericResponsePagination<BlogType[], Pagination>>(
      "/blogs",
      { ...query, limit: query.limit || 100 },
    )).data;
  }

  async getBlogDetail(slug: string) {
    return (await  this.get<IGenericResponse<BlogType>>(
      `/blogs/${slug}`,
      { view: true },
      true,
    ))?.data;
  }
  
  async createBlog(payload: any) {
    return (await this.post<BlogType>(`/blogs`, payload, {}, false))?.data
  }
  
  async updateBlog(id:number,payload: any) {
    return (await this.put<BlogType>(`/blogs/${id}`, payload, {}, false))?.data
  }
  
  async deleteBlog(id: number) {
    return (await this.remove<BlogType>(`/blogs/${id}`, {}, false))?.data
  }
}

export const blogService = new BlogService();
