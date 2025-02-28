import { AxiosRequestHeaders } from "axios";
import ApiClient, { AUTH_TOKEN_TYPE } from "../ApiClient.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

interface OAuthTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

const LOGIN_URL = "https://api.login.yahoo.com/oauth2";

class YahooAuth {
    // Basic Authorization clientId:clientSecret encoded in base64
    private authToken: string;

    private accessToken: string = process.env.ACCESS_TOKEN || "";
    private refreshToken: string = process.env.REFRESH_TOKEN || "";
    private tokenExpiration = process.env.TOKEN_EXPIRATION
        ? new Date(process.env.TOKEN_EXPIRATION)
        : new Date();

    private yahooAuthClient: ApiClient;

    constructor() {
        this.authToken = process.env.AUTH_TOKEN || "";
        if (!this.authToken) {
            throw new Error("AUTH_TOKEN is required and must not be empty.");
        }

        this.yahooAuthClient = new ApiClient(LOGIN_URL, {
            "Content-Type": "application/x-www-form-urlencoded",
        } as AxiosRequestHeaders);
        this.yahooAuthClient.setAuthToken(
            AUTH_TOKEN_TYPE.Basic,
            this.authToken
        );
    }

    isTokenExpired(): boolean {
        const currentTime = new Date();

        if (currentTime.getTime() > this.tokenExpiration.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    async getAccessToken(): Promise<string> {
        // If token is expired, refresh it:
        if (this.isTokenExpired()) {
            await this.refreshAccessToken();
        } else if (this.accessToken === "") {
            // If token hasn't been retrieved yet, retrieve it:
            await this.retrieveAccessToken();
        }
        // token is not expired:
        return this.accessToken;
    }

    // Exchange Auth token for Access Token
    async retrieveAccessToken(): Promise<void> {
        try {
            const response = await this.yahooAuthClient.post(
                "/get_token",
                new URLSearchParams({
                    grant_type: "authorization_code",
                    redirect_uri: "oob",
                    code: "", // TODO: auto fill in from OAuth flow
                })
            );
            this.updateTokens(response.data as unknown as OAuthTokenResponse);
        } catch (error) {
            console.error("Failed to access token from Yahoo: ", error);
            throw error;
        }
    }

    async refreshAccessToken(): Promise<void> {
        try {
            const response = await this.yahooAuthClient.post(
                "/get_token",
                new URLSearchParams({
                    grant_type: "refresh_token",
                    redirect_uri: "oob",
                    refresh_token: this.refreshToken,
                })
            );
            this.updateTokens(response.data as unknown as OAuthTokenResponse);
        } catch (error) {
            console.error("Failed to access token from Yahoo: ", error);
            throw error;
        }
    }

    updateTokens(oauthTokenResponse: OAuthTokenResponse) {
        this.accessToken = oauthTokenResponse.access_token;
        this.refreshToken = oauthTokenResponse.refresh_token;
        this.tokenExpiration = this.calculateExpirationDate(
            oauthTokenResponse.expires_in
        );

        const envFilePath = path.resolve(__dirname, "../../../../../.env");
        const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

        envConfig["ACCESS_TOKEN"] = this.accessToken;
        envConfig["REFRESH_TOKEN"] = this.refreshToken;
        envConfig["TOKEN_EXPIRATION"] = this.tokenExpiration.toISOString();

        // Convert the configuration back to a string
        const envContent = Object.keys(envConfig)
            .map((envKey) => `${envKey}=${envConfig[envKey]}`)
            .join("\n");

        // Write the updated content back to the .env file
        fs.writeFileSync(envFilePath, envContent);
    }

    calculateExpirationDate(seconds: number) {
        const currentDate = new Date();
        const futureTimestamp = currentDate.getTime() + seconds * 1000; // getTime returns the time in milliseconds

        return new Date(futureTimestamp);
    }
}

export const yahooAuth = new YahooAuth();
