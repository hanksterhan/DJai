export class HttpClient {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor(baseUrl: string, headers?: HeadersInit) {
        this.baseUrl = baseUrl;
        this.headers = headers || {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    private async request(
        method: string,
        url: string,
        body?: any
    ): Promise<any> {
        const response = await fetch(`${this.baseUrl}${url}`, {
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

    async get(url: string): Promise<any> {
        return this.request("GET", url);
    }

    async post(url: string, body: any): Promise<any> {
        return this.request("POST", url, body);
    }

    async put(url: string, body: any): Promise<any> {
        return this.request("PUT", url, body);
    }

    async patch(url: string, body: any): Promise<any> {
        return this.request("PATCH", url, body);
    }
}

export const httpClient = new HttpClient("http://localhost:3000");
