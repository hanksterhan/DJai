export abstract class BaseHttpClient {
    protected abstract baseUrl: string;
    protected headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    protected async request<T>(
        method: string,
        endpoint: string,
        body?: unknown
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: this.headers,
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return response.json();
    }

    protected async get<T>(endpoint: string): Promise<T> {
        return this.request<T>("GET", endpoint);
    }

    protected async post<T>(endpoint: string, body: unknown): Promise<T> {
        return this.request<T>("POST", endpoint, body);
    }

    protected async put<T>(endpoint: string, body: unknown): Promise<T> {
        return this.request<T>("PUT", endpoint, body);
    }

    protected async patch<T>(endpoint: string, body: unknown): Promise<T> {
        return this.request<T>("PATCH", endpoint, body);
    }

    protected async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>("DELETE", endpoint);
    }

    protected setHeader(key: string, value: string): void {
        this.headers = {
            ...this.headers,
            [key]: value,
        };
    }
}

export abstract class ApiClient extends BaseHttpClient {
    protected baseUrl = "http://localhost:3000";
}
