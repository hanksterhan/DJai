import { AxiosRequestHeaders } from "axios";
import ApiClient, { AUTH_TOKEN_TYPE } from "../ApiClient.js";
import { generateRandomString } from "../../utils/random";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

// Validate required environment variables
const requiredEnvVars = [
    "SPOTIFY_CLIENT_ID",
    "SPOTIFY_CLIENT_SECRET",
    "SPOTIFY_REDIRECT_URI",
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} is required in environment variables`);
    }
}

interface OAuthTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
}

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize?";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

class SpotifyAuth {
    private accessToken: string = "";
    private refreshToken: string = "";
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private state: string = "";
    private tokenExpiration: Date = new Date();
    private debugForceExpired: boolean = true;

    private spotifyAuthClient: ApiClient;

    /**
     * Initializes the Spotify authentication client
     * @throws Error if required environment variables are not set
     */
    constructor() {
        // Initialize required values from environment
        this.clientId = process.env.SPOTIFY_CLIENT_ID!;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
        this.redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

        // Initialize client with content-type header and basic auth
        this.spotifyAuthClient = new ApiClient(SPOTIFY_TOKEN_URL, {
            "Content-Type": "application/x-www-form-urlencoded",
        } as AxiosRequestHeaders);

        // Set basic auth with client credentials
        const basicAuth = Buffer.from(
            this.clientId + ":" + this.clientSecret
        ).toString("base64");
        this.spotifyAuthClient.setAuthToken(AUTH_TOKEN_TYPE.Basic, basicAuth);
    }

    /**
     * Composes the authorization URL for Spotify OAuth login
     * @returns A URL string to redirect users for Spotify authentication
     */
    composeAuthUrl(): string {
        this.state = generateRandomString(16);
        const scope = "user-read-private user-read-email";

        const params = new URLSearchParams({
            response_type: "code",
            client_id: this.clientId,
            scope,
            redirect_uri: this.redirectUri,
            state: this.state,
        });

        return `${SPOTIFY_AUTH_URL}${params.toString()}`;
    }

    /**
     * Exchanges an authorization code for access and refresh tokens
     * @param authCode - The authorization code received from Spotify's OAuth callback
     * @param state - The state parameter received from Spotify's OAuth callback
     * @throws Error if state doesn't match (CSRF attack prevention)
     * @throws Error if token request fails
     */
    async requestAccessToken(authCode: string, state: string): Promise<void> {
        if (state !== this.state) {
            throw new Error("State mismatch! Possible CSRF attack");
        }

        try {
            const response = await this.spotifyAuthClient.post(
                "",
                new URLSearchParams({
                    code: authCode,
                    redirect_uri: this.redirectUri,
                    grant_type: "authorization_code",
                })
            );

            const tokenResponse = response.data as OAuthTokenResponse;

            // Store the tokens
            this.accessToken = tokenResponse.access_token;
            this.refreshToken = tokenResponse.refresh_token;
            this.tokenExpiration = this.calculateExpirationDate(
                tokenResponse.expires_in
            );

            // Update the API client's auth token to Bearer for future requests
            this.spotifyAuthClient.setAuthToken(
                AUTH_TOKEN_TYPE.Bearer,
                this.accessToken
            );
        } catch (error) {
            console.error(
                "Failed to request access token from Spotify:",
                error
            );
            throw error;
        }
    }

    /**
     * Checks if the current access token has expired
     * @returns true if the current time is past the token expiration time
     * @private
     */
    private isTokenExpired(): boolean {
        if (this.debugForceExpired) {
            return true;
        }
        const currentTime = new Date();
        return currentTime.getTime() > this.tokenExpiration.getTime();
    }

    /**
     * Retrieves a valid access token, refreshing it if necessary
     * @returns A promise that resolves to the current valid access token
     * @throws Error if token refresh fails
     */
    async getAccessToken(): Promise<string> {
        if (this.isTokenExpired() && this.refreshToken) {
            await this.refreshAccessToken();
        }
        return this.accessToken;
    }

    /**
     * Refreshes the access token using the stored refresh token
     * @throws Error if the token refresh request fails
     * @private
     */
    private async refreshAccessToken(): Promise<void> {
        try {
            const response = await this.spotifyAuthClient.post(
                "",
                new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: this.refreshToken,
                })
            );

            const tokenResponse = response.data as OAuthTokenResponse;

            // Update tokens and expiration
            this.accessToken = tokenResponse.access_token;
            if (tokenResponse.refresh_token) {
                this.refreshToken = tokenResponse.refresh_token;
            }
            this.tokenExpiration = this.calculateExpirationDate(
                tokenResponse.expires_in
            );

            // Update the API client's auth token
            this.spotifyAuthClient.setAuthToken(
                AUTH_TOKEN_TYPE.Bearer,
                this.accessToken
            );
        } catch (error) {
            console.error(
                "Failed to refresh access token from Spotify:",
                error
            );
            throw error;
        }
    }

    /**
     * Calculates when a token will expire based on its expiration time
     * @param expiresIn - Number of seconds until the token expires
     * @returns Date object representing when the token will expire
     * @private
     */
    private calculateExpirationDate(expiresIn: number): Date {
        const currentDate = new Date();
        return new Date(currentDate.getTime() + expiresIn * 1000);
    }

    /**
     * Checks if we have valid authentication credentials
     * @returns true if we have a valid access token or can refresh it
     */
    async isAuthenticated(): Promise<boolean> {
        try {
            if (!this.isTokenExpired()) {
                return true;
            }
            if (this.refreshToken) {
                await this.refreshAccessToken();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking authentication status:", error);
            return false;
        }
    }

    /**
     * Sets debug mode to force token expiration
     * @param forceExpired - Whether to force the token to be considered expired
     */
    setDebugForceExpired(forceExpired: boolean): void {
        this.debugForceExpired = forceExpired;
        console.log(`Debug mode: Force token expired = ${forceExpired}`);
    }

    /**
     * Gets the current debug mode status
     * @returns Whether debug mode is forcing token expiration
     */
    getDebugForceExpired(): boolean {
        return this.debugForceExpired;
    }
}

export const spotifyAuth = new SpotifyAuth();
