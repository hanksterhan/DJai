export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string | null;
    public: boolean;
    tracks: {
        total?: number;
    };
}

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: {
        id: string;
        name: string;
    }[];
    album: {
        id: string;
        name: string;
        images: {
            url: string;
            height: number;
            width: number;
        }[];
    };
    duration_ms: number;
    uri: string;
}

export interface SpotifyPlaylistTrackItem {
    added_at: string;
    track: SpotifyTrack;
}

export interface PlaylistWithTracks extends Omit<SpotifyPlaylist, "tracks"> {
    tracks: SpotifyPlaylistTrackItem[];
}

export interface PlaylistDetails extends PlaylistWithTracks {
    tracksTotal: number;
    isLoadingTracks: boolean;
    tracksError?: string;
}

export interface SpotifyPlaylistTrackResponse {
    href: string;
    items: SpotifyPlaylistTrackItem[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}

export interface SpotifyPlaylistsResponse {
    items: SpotifyPlaylist[];
    total: number;
    limit: number;
    offset: number;
}
