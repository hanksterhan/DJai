import { ApiClient } from "./fetch";
import {
    ApiResponse,
    SpotifyAuthResponse,
    SpotifyAuthStatus,
    SpotifyTokenResponse,
} from "@common/interfaces";

enum SPOTIFY_AUTH_ENDPOINTS {
    LOGIN = "/api/spotify/login",
    CALLBACK = "/api/spotify/callback",
    TOKEN = "/api/spotify/token",
    AUTH_STATUS = "/api/spotify/auth-status",
}

export class SpotifyAuthService extends ApiClient {
    async login(): Promise<void> {
        const response = await this.get<ApiResponse<SpotifyAuthResponse>>(
            SPOTIFY_AUTH_ENDPOINTS.LOGIN
        );

        if (response.data.url) {
            window.location.href = response.data.url;
        } else {
            throw new Error("Failed to get Spotify authorization URL");
        }
    }

    async getAuthStatus(): Promise<SpotifyAuthStatus> {
        const response = await this.get<ApiResponse<SpotifyAuthStatus>>(
            SPOTIFY_AUTH_ENDPOINTS.AUTH_STATUS
        );
        return response.data;
    }

    async getAccessToken(): Promise<string> {
        const response = await this.get<ApiResponse<SpotifyTokenResponse>>(
            SPOTIFY_AUTH_ENDPOINTS.TOKEN
        );
        return response.data.access_token;
    }

    async handleCallback(code: string, state: string): Promise<void> {
        await this.post<ApiResponse<void>>(SPOTIFY_AUTH_ENDPOINTS.CALLBACK, {
            code,
            state,
        });
    }
}

export const spotifyAuthService = new SpotifyAuthService();
