import { AxiosRequestHeaders } from "axios";
import ApiClient, { AUTH_TOKEN_TYPE } from "../ApiClient.js";
import {
    SpotifyPlaylistsResponse,
    SpotifyPlaylistTrackResponse,
} from "@common/interfaces";

import { spotifyAuth } from "./spotifyAuth.js";

const BASE_URL = "https://fantasysports.yahooapis.com/fantasy/v2";
class Yahoo {
    private accessToken: string = "";

    private spotifyApiClient: ApiClient;

    constructor() {
        this.accessToken = process.env.ACCESS_TOKEN || "";

        this.spotifyApiClient = new ApiClient(BASE_URL, {
            "Content-Type": "application/x-www-form-urlencoded",
        } as AxiosRequestHeaders);
        this.spotifyApiClient.setAuthToken(
            AUTH_TOKEN_TYPE.Bearer,
            this.accessToken
        );
    }

    /**
     * Get or refresh access token from Yahoo and set it in the api client
     */
    async init(): Promise<void> {
        this.accessToken = await spotifyAuth.getAccessToken();
        this.spotifyApiClient.setAuthToken(
            AUTH_TOKEN_TYPE.Bearer,
            this.accessToken
        );
    }
}

export const yahoo = new Yahoo();
yahoo.init();

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

class Spotify {
    private spotifyApiClient: ApiClient;

    constructor() {
        this.spotifyApiClient = new ApiClient(SPOTIFY_API_URL, {
            "Content-Type": "application/json",
        } as AxiosRequestHeaders);
    }

    async setAccessToken(token: string): Promise<void> {
        this.spotifyApiClient.setAuthToken(AUTH_TOKEN_TYPE.Bearer, token);
    }

    async getCurrentUserId(): Promise<string> {
        const response = await this.spotifyApiClient.get<{ id: string }>("/me");
        return response.data.id;
    }

    async getUserPlaylists(
        limit: number = 20,
        offset: number = 0
    ): Promise<SpotifyPlaylistsResponse> {
        const userId = await this.getCurrentUserId();
        const response =
            await this.spotifyApiClient.get<SpotifyPlaylistsResponse>(
                `/users/${userId}/playlists`,
                {
                    params: {
                        limit,
                        offset,
                    },
                }
            );
        return response.data;
    }

    async getPlaylistTracks(
        playlistId: string,
        offset = 0,
        limit = 20
    ): Promise<SpotifyPlaylistTrackResponse> {
        const response =
            await this.spotifyApiClient.get<SpotifyPlaylistTrackResponse>(
                `/playlists/${playlistId}/tracks`,
                {
                    params: {
                        offset,
                        limit,
                    },
                }
            );
        return response.data;
    }
}

export const spotify = new Spotify();
