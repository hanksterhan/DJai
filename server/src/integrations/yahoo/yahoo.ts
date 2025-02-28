import { AxiosRequestHeaders } from "axios";
import ApiClient, { AUTH_TOKEN_TYPE } from "../ApiClient.js";

import { yahooAuth } from "./yahooAuth.js";

const BASE_URL = "https://fantasysports.yahooapis.com/fantasy/v2";
class Yahoo {
    private accessToken: string = "";

    private yahooApiClient: ApiClient;

    constructor() {
        this.accessToken = process.env.ACCESS_TOKEN || "";

        this.yahooApiClient = new ApiClient(BASE_URL, {
            "Content-Type": "application/x-www-form-urlencoded",
        } as AxiosRequestHeaders);
        this.yahooApiClient.setAuthToken(
            AUTH_TOKEN_TYPE.Bearer,
            this.accessToken
        );
    }

    /**
     * Get or refresh access token from Yahoo and set it in the api client
     */
    async init(): Promise<void> {
        this.accessToken = await yahooAuth.getAccessToken();
        this.yahooApiClient.setAuthToken(
            AUTH_TOKEN_TYPE.Bearer,
            this.accessToken
        );
    }
}

export const yahoo = new Yahoo();
yahoo.init();
