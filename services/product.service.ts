import HttpService from "@/services/http.service";
import {
	IGenericResponse,
	IGenericResponsePagination,
} from "@/types/service.type";
import {GetAllFilter, Pagination, Product} from "@/types/app.type";

class ProductService extends HttpService {
	async getAllProducts(query: GetAllFilter) {
		return this.get<IGenericResponsePagination<Product[], Pagination>>(
			"/products",
			{...query, limit: query.limit || 20},
			true,
		);
	}
	
	async getProduct(slug: string) {
		return (await this.get<IGenericResponse<Product>>(`/products/${slug}`, {}, true))?.data;
	}
	
	async updateProduct(id: number, payload: any) {
		return (await this.put<IGenericResponse<Product>>(`/products/${id}`, payload, {}, true))?.data;
	}
	
	async createProduct(payload: any) {
		console.log("payload", payload)
		return (await this.post<IGenericResponse<Product>>(`/products`, payload, {}, true))?.data;
	}
}

export const productService = new ProductService();
