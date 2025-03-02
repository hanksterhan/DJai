export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string | null;
    public: boolean;
    tracks: {
        total: number;
    };
}

export interface SpotifyPlaylistsResponse {
    items: SpotifyPlaylist[];
    total: number;
    limit: number;
    offset: number;
}
