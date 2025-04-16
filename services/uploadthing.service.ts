/**
 * TypeScript Implementation of UTApi based on uploadthing documentation
 * https://docs.uploadthing.com/api-reference/ut-api
 * Using axios instead of fetch
 */
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {UTApi} from "uploadthing/server";

// Type definitions
type FileKey = string;
type UploadThingError = {
	code: string;
	message: string;
	data?: Record<string, any>;
};

interface UploadedFileData {
	key: string;
	name: string;
	url: string;
	size: number;
	uploadedAt: Date;
	metadata?: Record<string, any>;
}

interface ListFilesOptions {
	limit?: number;
	offset?: number;
	cursor?: string;
	sortBy?: "newest" | "oldest" | "smallest" | "largest";
}

interface ListFilesResponse {
	files: UploadedFileData[];
	cursor?: string;
	hasMore: boolean;
}

interface DeleteFilesResponse {
	success: boolean;
	fileKeys: FileKey[];
}

interface UTApiConfig {
	apiKey: string;
}

/**
 * UTApi Class to interact with the uploadthing API using axios
 */
class UTApiService {
	private apiKey: string;
	private baseUrl: string = "https://uploadthing.com/api/";
	private axiosInstance: AxiosInstance;
	private utApi: UTApi
	
	/**
	 * Create a new UTApi instance
	 * @param config Configuration options for the UTApi
	 */
	constructor(config: UTApiConfig) {
		this.apiKey = config.apiKey;
		this.utApi = new UTApi({})
		// Create axios instance with default config
		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
			headers: {
				"Content-Type": "application/json",
				"x-uploadthing-api-key": this.apiKey
			}
		});
	}
	
	/**
	 * List files uploaded to your uploadthing app
	 * @param options Options to filter and paginate the files
	 * @returns A promise that resolves to the list of files
	 */
	async listFiles(options?: ListFilesOptions): Promise<ListFilesResponse> {
		try {
			const params: Record<string, any> = {};
			
			if (options?.limit) params.limit = options.limit;
			if (options?.offset) params.offset = options.offset;
			if (options?.cursor) params.cursor = options.cursor;
			if (options?.sortBy) params.sortBy = options.sortBy;
			
			const response = await this.axiosInstance.get('files', {params});
			return response.data as ListFilesResponse;
		} catch (error) {
			throw this.handleError(error);
		}
	}
	
	/**
	 * Delete one or more files from your uploadthing app
	 * @param fileKeys A single file key or an array of file keys to delete
	 * @returns A promise that resolves to the deletion result
	 */
	async deleteFiles(fileKeys: FileKey | FileKey[]): Promise<DeleteFilesResponse> {
		try {
			const keys = Array.isArray(fileKeys) ? fileKeys : [fileKeys];
			
			const response = await this.utApi.deleteFiles(keys);
			
			console.log(response)
			
			return response as DeleteFilesResponse;
		} catch (error) {
			throw this.handleError(error);
		}
	}
	
	/**
	 * Get metadata for a specific file
	 * @param fileKey The key of the file to get metadata for
	 * @returns A promise that resolves to the file metadata
	 */
	async getFileMetadata(fileKey: FileKey): Promise<UploadedFileData> {
		try {
			const response = await this.axiosInstance.get(`files/${fileKey}`);
			return response.data as UploadedFileData;
		} catch (error) {
			throw this.handleError(error);
		}
	}
	
	/**
	 * Create a presigned URL to upload a file to your uploadthing app
	 * @param input Options for creating the presigned URL
	 * @returns A promise that resolves to the presigned URL
	 */
	async createPresignedUrl(input: {
		fileName: string;
		fileSize: number;
		contentType: string;
		fileKey?: string;
	}): Promise<{
		presignedUrl: string;
		fileKey: string;
	}> {
		try {
			const response = await this.axiosInstance.post('presignedUrls', input);
			return response.data as { presignedUrl: string; fileKey: string };
		} catch (error) {
			throw this.handleError(error);
		}
	}
	
	/**
	 * Handles errors from the API
	 * @param error The error to handle
	 * @returns The formatted error
	 */
	private handleError(error: any): UploadThingError {
		if (axios.isAxiosError(error)) {
			const errorData = error.response?.data;
			
			if (errorData?.code && errorData?.message) {
				return errorData as UploadThingError;
			}
			
			return {
				code: error.code || "AXIOS_ERROR",
				message: error.message || "A network error occurred"
			};
		}
		
		return {
			code: "UNKNOWN_ERROR",
			message: error.message || "An unknown error occurred"
		};
	}
}

export const uTApiService = new UTApiService({apiKey: process.env.NEXT_PUBLIC_UPLOADTHING_API_KEY || ""});