import { action, makeObservable, observable, runInAction } from "mobx";
import { spotifyService } from "../../services/spotifyService";
import { PlaylistDetails, SpotifyPlaylistTrackItem } from "@common/interfaces";
import { currentlyPlayingStore } from "../CurrentlyPlayingStore/currentlyPlayingStore";
import { spotifyAuthService } from "../../services/spotifyAuthService";

interface PlaylistMap {
    [key: string]: PlaylistDetails;
}

export class PlaylistStore {
    @observable playlists: PlaylistMap = {};
    @observable isLoading: boolean = false;
    @observable error: string | null = null;
    @observable currentQueue: SpotifyPlaylistTrackItem[] = [];
    @observable currentQueueIndex: number = -1;
    @observable hasLoadedPlaylists: boolean = false;

    constructor() {
        makeObservable(this);
    }

    @action
    setCurrentQueue(tracks: SpotifyPlaylistTrackItem[]) {
        this.currentQueue = tracks;
    }

    @action
    setCurrentQueueIndex(index: number) {
        this.currentQueueIndex = index;
    }

    @action
    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    @action
    setError(error: string | null) {
        this.error = error;
    }

    @action
    async playPlaylist(playlistId: string) {
        try {
            // Fetch tracks if not already loaded
            if (!this.playlists[playlistId]?.tracks?.length) {
                await this.fetchPlaylistTracks(playlistId);
            }

            const playlist = this.playlists[playlistId];
            if (!playlist?.tracks?.length) {
                throw new Error("No tracks found in playlist");
            }

            // Set up the queue
            this.setCurrentQueue(playlist.tracks);
            this.setCurrentQueueIndex(0);

            // Play the first track
            const firstTrack = playlist.tracks[0].track;
            await this.playTrack(firstTrack.uri);
        } catch (error) {
            console.error("Failed to play playlist:", error);
            this.setError(
                error instanceof Error
                    ? error.message
                    : "Failed to play playlist"
            );
        }
    }

    @action
    async playNextTrack() {
        if (this.currentQueueIndex < this.currentQueue.length - 1) {
            this.currentQueueIndex++;
            const nextTrack = this.currentQueue[this.currentQueueIndex].track;
            await this.playTrack(nextTrack.uri);
        }
    }

    @action
    async playPreviousTrack() {
        if (this.currentQueueIndex > 0) {
            this.currentQueueIndex--;
            const previousTrack =
                this.currentQueue[this.currentQueueIndex].track;
            await this.playTrack(previousTrack.uri);
        }
    }

    private async playTrack(uri: string) {
        try {
            const deviceId = currentlyPlayingStore.getDeviceId;
            if (!deviceId) {
                throw new Error("No active device found.");
            }

            const token = await spotifyAuthService.getAccessToken();
            await fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uris: [uri],
                    }),
                }
            );
        } catch (error) {
            console.error("Failed to play track:", error);
            throw error;
        }
    }

    @action
    async fetchPlaylists() {
        // If we've already loaded playlists, don't fetch again
        if (this.hasLoadedPlaylists) {
            return;
        }

        this.setIsLoading(true);
        this.setError(null);

        try {
            const response = await spotifyService.getPlaylists();

            runInAction(() => {
                response.items.forEach((playlist) => {
                    const existingTracks =
                        this.playlists[playlist.id]?.tracks || [];
                    this.playlists[playlist.id] = {
                        ...playlist,
                        tracks: existingTracks,
                        tracksTotal: playlist.tracks.total || 0,
                        isLoadingTracks: false,
                        tracksError: undefined,
                    };
                });
                this.hasLoadedPlaylists = true;
            });
        } catch (error) {
            runInAction(() => {
                this.setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch playlists"
                );
            });
        } finally {
            runInAction(() => {
                this.setIsLoading(false);
            });
        }
    }

    @action
    async fetchPlaylistTracks(
        playlistId: string,
        onProgress?: (progress: number) => void
    ) {
        if (!this.playlists[playlistId]) {
            throw new Error("Playlist not found");
        }

        runInAction(() => {
            this.playlists[playlistId].isLoadingTracks = true;
            this.playlists[playlistId].tracksError = undefined;
        });

        try {
            const tracks = await spotifyService.getAllPlaylistTracks(
                playlistId,
                onProgress
            );

            runInAction(() => {
                this.playlists[playlistId].tracks = tracks;
            });

            return tracks;
        } catch (error) {
            runInAction(() => {
                this.playlists[playlistId].tracksError =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch tracks";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.playlists[playlistId].isLoadingTracks = false;
            });
        }
    }

    getPlaylist(playlistId: string): PlaylistDetails | undefined {
        return this.playlists[playlistId];
    }

    get playlistArray(): PlaylistDetails[] {
        return Object.values(this.playlists);
    }

    get loadedPlaylistsCount(): number {
        return Object.values(this.playlists).filter((p) => p.tracks.length > 0)
            .length;
    }
}

export const playlistStore = new PlaylistStore();
