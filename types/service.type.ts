export interface IParams {
	[key: string]: any;
}

export interface IGenericOptions {
	url: string;
	params?: IParams;
}

export interface IGenericResponse<T> {
	status: string;
	message: string;
	data: T;
}

export interface IGenericResponsePagination<T, K = any>
	extends IGenericResponse<T> {
	pagination: K;
}

export interface IErrorResponse {
	// *This can depending on your backend server error response
	status: string;
	message: string;
}
