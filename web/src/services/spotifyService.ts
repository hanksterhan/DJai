import { ApiClient } from "./fetch";
import { ApiResponse, SpotifyPlaylistsResponse } from "@common/interfaces";

enum SPOTIFY_ENDPOINTS {
    PLAYLISTS = "/api/spotify/playlists",
}

export class SpotifyService extends ApiClient {
    async getPlaylists(): Promise<SpotifyPlaylistsResponse> {
        const response = await this.get<ApiResponse<SpotifyPlaylistsResponse>>(
            SPOTIFY_ENDPOINTS.PLAYLISTS
        );
        return response.data;
    }
}

export const spotifyService = new SpotifyService();
