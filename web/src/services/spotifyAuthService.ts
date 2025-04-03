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
    DEBUG_FORCE_EXPIRED = "/api/spotify/debug/force-expired",
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
            throw error; // Re-throw the error to be caught by the UserStore
        }
    }

    /**
     * Toggles debug mode to force token expiration
     * @param forceExpired - Whether to force the token to be considered expired
     * @returns The current debug mode status
     */
    async toggleDebugForceExpired(
        forceExpired: boolean
    ): Promise<{ debugForceExpired: boolean }> {
        try {
            const response = await this.post<
                ApiResponse<{ debugForceExpired: boolean }>
            >(SPOTIFY_AUTH_ENDPOINTS.DEBUG_FORCE_EXPIRED, { forceExpired });
            return response.data;
        } catch (error) {
            console.error("Failed to toggle debug mode:", error);
            throw error;
        }
    }
}

export const spotifyAuthService = new SpotifyAuthService();
