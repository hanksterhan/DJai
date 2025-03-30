import { action, makeObservable, observable, runInAction } from "mobx";
import { spotifyService } from "../../services/spotifyService";
import { PlaylistDetails } from "@common/interfaces";

interface PlaylistMap {
    [key: string]: PlaylistDetails;
}

export class PlaylistStore {
    constructor() {
        makeObservable(this, {
            playlists: observable,
            isLoading: observable,
            error: observable,
            fetchPlaylists: action,
            fetchPlaylistTracks: action,
            setError: action,
            setIsLoading: action,
        });
    }

    playlists: PlaylistMap = {};
    isLoading: boolean = false;
    error: string | null = null;

    setIsLoading(loading: boolean) {
        this.isLoading = loading;
    }

    setError(error: string | null) {
        this.error = error;
    }

    async fetchPlaylists() {
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
        } catch (error) {
            runInAction(() => {
                this.playlists[playlistId].tracksError =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch tracks";
            });
        } finally {
            runInAction(() => {
                this.playlists[playlistId].isLoadingTracks = false;
            });
        }
    }

    // Computed getters
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
