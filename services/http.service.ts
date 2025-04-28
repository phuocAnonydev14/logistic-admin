import axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig} from "axios";
import {getCookie} from "cookies-next";
import axiosRetry from "axios-retry";
import {jwtDecode} from "jwt-decode";
import {IParams} from "@/types/service.type";
import {EHttpMethod, EToken} from "@/lib/enum/app.enum";
import * as process from "process";
import {
	deleteCookieKey,
	getCookieKey,
	setCookieKey,
} from "@/lib/utils/getToken";

const isTokenExpired = (token: string) => {
	if (!token) return true;
	try {
		const decodedToken = jwtDecode(token);
		const currentTime = Date.now() / 1000;
		return decodedToken.exp! < currentTime;
	} catch (error) {
		console.error("Error decoding token:", error);
		return true;
	}
};

const handleRefreshToken = async () => {
	alert("Het phien dang nhap")
	window.location.href = "/login";
	try {
		const refreshToken = getCookie(EToken.REFRESH_TOKEN);
		if (!refreshToken) return;
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/refresh-token`,
			{
				refreshToken,
			},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			},
		);
		const {accessToken} = response.data?.data;
		await setCookieKey(EToken.ACCESS_TOKEN, accessToken);
		return accessToken;
	} catch (error) {
		console.error("Error refreshing token:", error);
		return null;
	}
};

class HttpService {
	private readonly http: AxiosInstance;
	private baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://vntranspbackend-production.up.railway.app/v1"
	// typeof window === "undefined"
	//   ? process.env.SERVER_API_URL
	//   : process.env.NEXT_PUBLIC_BASE_URL;
	constructor(customBaseUrl?: string) {
		this.http = axios.create({
			baseURL: customBaseUrl || this.baseURL,
		});
		this.injectInterceptors();
	}
	
	// Get authorization token for requests
	private async getAuthorization() {
		// get on client side
		let accessToken = getCookie(EToken.ACCESS_TOKEN) || "";
		// case get token on server side
		if (!accessToken && typeof window === "undefined") {
			const cookieStore = await import("next/headers").then((res) =>
				res.cookies(),
			);
			accessToken = cookieStore.get(EToken.ACCESS_TOKEN as any)?.value || "";
		}
		return accessToken ? {Authorization: `Bearer ${accessToken}`} : {};
	}
	
	// Initialize service configuration
	public service() {
		this.injectInterceptors();
		
		return this;
	}
	
	// Set up request headers
	private async setupHeaders(
		hasAttachment = false,
		isPublicApi = false,
	): Promise<AxiosRequestConfig["headers"]> {
		const headers: AxiosRequestConfig["headers"] = {
			"Content-Type": hasAttachment
				? "multipart/form-data"
				: "application/json",
		};
		
		if (!isPublicApi) {
			const auth = await this.getAuthorization();
			Object.assign(headers, auth);
		}
		
		return headers;
	}
	
	// Handle HTTP requests
	private async request<T>(
		method: EHttpMethod,
		url: string,
		options: AxiosRequestConfig,
	): Promise<T> {
		const response: AxiosResponse<T> = await this.http.request<T>({
			method,
			url,
			...options,
		});
		return response?.data || ({} as T);
	}
	
	// Perform GET request
	public async get<T>(
		url: string,
		params?: IParams,
		isPublicApi = false,
	): Promise<T> {
		return this.request<T>(EHttpMethod.GET, url, {
			params,
			headers: await this.setupHeaders(false, isPublicApi),
		});
	}
	
	// Perform POST request
	public async post<T, P = any>(
		url: string,
		payload: P,
		params?: IParams,
		isPublicApi = false,
	): Promise<T> {
		return this.request<T>(EHttpMethod.POST, url, {
			params,
			data: payload,
			headers: await this.setupHeaders(
				payload instanceof FormData,
				isPublicApi,
			),
		});
	}
	
	// Perform UPDATE request
	public async update<T, P = any>(
		url: string,
		payload: P,
		params?: IParams,
		isPublicApi = false,
	): Promise<T> {
		return this.request<T>(EHttpMethod.PATCH, url, {
			params,
			data: payload,
			headers: await this.setupHeaders(
				payload instanceof FormData,
				isPublicApi,
			),
		});
	}
	
	public async put<T, P = any>(
		url: string,
		payload: P,
		params?: IParams,
		isPublicApi = false,
	): Promise<T> {
		return this.request<T>(EHttpMethod.PUT, url, {
			params,
			data: payload,
			headers: await this.setupHeaders(
				payload instanceof FormData,
				isPublicApi,
			),
		});
	}
	
	// Perform DELETE request
	public async remove<T>(
		url: string,
		params?: IParams,
		isPublicApi = false,
	): Promise<T> {
		return this.request<T>(EHttpMethod.DELETE, url, {
			params,
			headers: await this.setupHeaders(false, isPublicApi),
		});
	}
	
	// Inject interceptors for request and response
	private injectInterceptors() {
		// Set up request interceptor
		// @ts-ignore
		this.http.interceptors.request.use(async (request) => {
			let accessToken = await getCookieKey(EToken.ACCESS_TOKEN);
			if (!accessToken) return request;
			const isExpired = isTokenExpired(accessToken);
			console.log("isExpired", isExpired);
			if (!isExpired) return request;
			
			console.log("token expired");
			await deleteCookieKey(EToken.ACCESS_TOKEN);
			const newAccessToken = await handleRefreshToken();
			return {
				...request,
				headers: {Authorization: `Bearer ${newAccessToken}`},
			};
		});
		
		// Retry logic with axios-retry
		axiosRetry(this.http, {
			retries: 3,
			retryCondition: (error) => {
				return (
					axiosRetry.isNetworkOrIdempotentRequestError(error) ||
					error.code === "ECONNABORTED"
				);
			},
			retryDelay: (retryCount) => {
				console.log(`Retry attempt: ${retryCount}`);
				return retryCount * 1000; // delay 1S
			},
		});
		
		// Set up response interceptor
		// @ts-ignore
		this.http.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				deleteCookieKey(EToken.ACCESS_TOKEN);
				deleteCookieKey(EToken.REFRESH_TOKEN);
				if (error.code === "ECONNABORTED") {
					console.error("Request timed out");
				}
				if (!error.response) return;
				const statusCode = error.response.status;
				if (statusCode === 401) {
					console.warn("Unauthorized. Redirecting to home page...");
					window.location.href = "/login";
					
				}
				
				if (statusCode === 403) {
					console.warn("Forbidden access");
				}
				
				if (statusCode === 500) {
					console.error("Internal Server Error");
				}
				return this.normalizeError(error);
			},
		);
	}
	
	// Normalize errors
	private normalizeError(error: any) {
		if (axios.isAxiosError(error)) {
			console.error("Axios error:", error.response?.data || error.message);
		} else {
			console.error("Unexpected error:", error);
		}
		return Promise.reject(error);
	}
}

export {HttpService as default};
