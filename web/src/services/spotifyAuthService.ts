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
        try {
            const response = await this.get<ApiResponse<SpotifyAuthResponse>>(
                SPOTIFY_AUTH_ENDPOINTS.LOGIN
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error("Failed to get Spotify authorization URL");
            }
        } catch (error) {
            console.error("Error in spotifyAuthService.login():", error);
            throw error; // Re-throw the error to be caught by the UserStore
        }
    }

    async getAuthStatus(): Promise<SpotifyAuthStatus> {
        try {
            const response = await this.get<ApiResponse<SpotifyAuthStatus>>(
                SPOTIFY_AUTH_ENDPOINTS.AUTH_STATUS
            );
            return response.data;
        } catch (error) {
            console.error(
                "Error in spotifyAuthService.getAuthStatus():",
                error
            );
            throw error; // Re-throw the error to be caught by the UserStore
        }
    }

    async getAccessToken(): Promise<string> {
        try {
            const response = await this.get<ApiResponse<SpotifyTokenResponse>>(
                SPOTIFY_AUTH_ENDPOINTS.TOKEN
            );
            return response.data.access_token;
        } catch (error) {
            console.error(
                "Error in spotifyAuthService.getAccessToken():",
                error
            );
            throw error; // Re-throw the error to be caught by the UserStore
        }
    }

    async handleCallback(code: string, state: string): Promise<void> {
        try {
            await this.post<ApiResponse<void>>(
                SPOTIFY_AUTH_ENDPOINTS.CALLBACK,
                {
                    code,
                    state,
                }
            );
        } catch (error) {
            console.error(
                "Error in spotifyAuthService.handleCallback():",
                error
            );
            throw error; // Re-throw the error to be caught by the UserStore
        }
    }
}

export const spotifyAuthService = new SpotifyAuthService();
