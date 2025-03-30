import { ApiClient } from "./fetch";
import {
    ApiResponse,
    SpotifyPlaylistsResponse,
    SpotifyPlaylistTrackResponse,
    SpotifyPlaylistTrackItem,
} from "@common/interfaces";
import { spotifyAuthService } from "./spotifyAuthService";

enum SPOTIFY_ENDPOINTS {
    PLAYLISTS = "/api/spotify/playlists",
    PLAYLIST_TRACKS = "/api/spotify/playlists/:playlistId/tracks",
}

export class SpotifyService extends ApiClient {
    async getPlaylists(): Promise<SpotifyPlaylistsResponse> {
        const token = await spotifyAuthService.getAccessToken();
        this.setHeader("Authorization", `Bearer ${token}`);

        const response = await this.get<ApiResponse<SpotifyPlaylistsResponse>>(
            SPOTIFY_ENDPOINTS.PLAYLISTS
        );
        return response.data;
    }

    async getPlaylistTracks(
        playlistId: string,
        offset: number = 0,
        limit: number = 20
    ): Promise<SpotifyPlaylistTrackResponse> {
        const token = await spotifyAuthService.getAccessToken();
        this.setHeader("Authorization", `Bearer ${token}`);

        const endpoint = SPOTIFY_ENDPOINTS.PLAYLIST_TRACKS.replace(
            ":playlistId",
            playlistId
        );

        const response = await this.get<
            ApiResponse<SpotifyPlaylistTrackResponse>
        >(endpoint + `?offset=${offset}&limit=${limit}`);
        return response.data;
    }

    /**
     * Fetches all tracks from a playlist by handling pagination internally
     * @param playlistId The Spotify playlist ID
     * @param progressCallback Optional callback to track loading progress (0-100)
     * @returns Array of all playlist tracks
     */
    async getAllPlaylistTracks(
        playlistId: string,
        progressCallback?: (progress: number) => void
    ): Promise<SpotifyPlaylistTrackItem[]> {
        const BATCH_SIZE = 50; // Fetch 50 tracks at a time for efficiency
        let allTracks: SpotifyPlaylistTrackItem[] = [];

        // Get initial batch to determine total
        const firstBatch = await this.getPlaylistTracks(
            playlistId,
            0,
            BATCH_SIZE
        );
        allTracks = [...firstBatch.items];

        const totalTracks = firstBatch.total;
        let currentProgress = (allTracks.length / totalTracks) * 100;
        progressCallback?.(currentProgress);

        // Continue fetching if there are more tracks
        while (allTracks.length < totalTracks) {
            const nextBatch = await this.getPlaylistTracks(
                playlistId,
                allTracks.length,
                BATCH_SIZE
            );
            allTracks = [...allTracks, ...nextBatch.items];

            currentProgress = (allTracks.length / totalTracks) * 100;
            progressCallback?.(currentProgress);
        }

        return allTracks;
    }
}

export const spotifyService = new SpotifyService();
