export interface SpotifyAuthResponse {
    url: string;
}

export interface SpotifyAuthStatus {
    isAuthenticated: boolean;
}

export interface SpotifyTokenResponse {
    access_token: string;
}

export interface ApiResponse<T> {
    data: T;
}
