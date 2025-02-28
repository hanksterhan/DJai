import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
    AxiosRequestHeaders,
} from "axios";

export enum AUTH_TOKEN_TYPE {
    Basic = "Basic",
    Bearer = "Bearer",
}

class ApiClient {
    private client: AxiosInstance;

    constructor(
        baseURL: string,
        headers: AxiosRequestHeaders = {} as AxiosRequestHeaders
    ) {
        if (!baseURL) {
            throw new Error(
                "Base URL is required to create an ApiClient instance."
            );
        }

        this.client = axios.create({
            baseURL,
            headers,
        });

        // Request interceptor
        this.client.interceptors.request.use(
            this.handleRequest,
            this.handleError
        );

        // Response interceptor
        this.client.interceptors.response.use(
            this.handleResponse,
            this.handleError
        );
    }

    private handleRequest(
        config: InternalAxiosRequestConfig
    ): InternalAxiosRequestConfig {
        // Add any request transformations or headers here
        return config;
    }

    private handleResponse(response: AxiosResponse): AxiosResponse {
        // Add any response transformations here
        return response;
    }

    private handleError(error: AxiosError): Promise<AxiosError> {
        // Centralized error handling
        console.error("API Error:", error);
        return Promise.reject(error);
    }

    setAuthToken(tokenType: AUTH_TOKEN_TYPE, authToken: string) {
        this.client.defaults.headers.common.Authorization = `${tokenType} ${authToken}`;
    }

    public get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.client.get<T>(url, config);
    }

    public post<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.client.post<T>(url, data, config);
    }

    public put<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.client.put<T>(url, data, config);
    }

    public delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.client.delete<T>(url, config);
    }
}

export default ApiClient;
