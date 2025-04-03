import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";
import { currentlyPlayingStore } from "../../stores/CurrentlyPlayingStore/currentlyPlayingStore";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: {
            Player: new (config: {
                name: string;
                getOAuthToken: (cb: (token: string) => void) => void;
                volume?: number;
            }) => any;
        };
    }
}

interface PlayerState {
    track_window: {
        current_track: {
            name: string;
            uri: string;
            artists: { name: string }[];
            album: {
                name: string;
                images: { url: string }[];
            };
        };
    };
    paused: boolean;
}

@customElement("spotify-player")
export class SpotifyPlayer extends MobxLitElement {
    static styles = styles;

    @state()
    private player: any = null;

    @state()
    private error: string | null = null;

    @state()
    private isInitializing: boolean = true;

    connectedCallback() {
        super.connectedCallback();
        this.initializePlayer();
    }

    private initializePlayer() {
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.player = new window.Spotify.Player({
                name: "DJai Web Player",
                getOAuthToken: (cb: (token: string) => void) => {
                    spotifyAuthService
                        .getAccessToken()
                        .then((token) => cb(token))
                        .catch((error) => {
                            console.error("Failed to get access token:", error);
                            this.error = "Failed to connect to Spotify";
                        });
                },
                volume: 0.5,
            });

            this.player.addListener(
                "ready",
                ({ device_id }: { device_id: string }) => {
                    console.log("Ready with Device ID", device_id);
                    currentlyPlayingStore.setDeviceId(device_id);
                    this.isInitializing = false;
                    this.error = null;
                }
            );

            this.player.addListener(
                "initialization_error",
                ({ message }: { message: string }) => {
                    console.error("Failed to initialize:", message);
                    this.error = "Failed to initialize Spotify player";
                    this.isInitializing = false;
                }
            );

            this.player.addListener(
                "authentication_error",
                ({ message }: { message: string }) => {
                    console.error("Failed to authenticate:", message);
                    this.error = "Failed to authenticate with Spotify";
                    this.isInitializing = false;
                }
            );

            this.player.addListener(
                "account_error",
                ({ message }: { message: string }) => {
                    console.error(
                        "Failed to validate Spotify account:",
                        message
                    );
                    this.error = "Please check your Spotify account settings";
                    this.isInitializing = false;
                }
            );

            this.player.addListener(
                "player_state_changed",
                (state: PlayerState | null) => {
                    if (!state) return;

                    const currentTrack = state.track_window.current_track;
                    currentlyPlayingStore.setCurrentTrack({
                        name: currentTrack.name,
                        uri: currentTrack.uri,
                        artists: currentTrack.artists,
                        album: {
                            name: currentTrack.album.name,
                            images: currentTrack.album.images,
                        },
                    });
                    currentlyPlayingStore.setIsPlaying(!state.paused);
                }
            );

            this.player.connect().catch((error: Error) => {
                console.error("Failed to connect:", error);
                this.error = "Failed to connect to Spotify player";
                this.isInitializing = false;
            });
        };
    }

    public async togglePlay() {
        if (!this.player) {
            this.error = "Player not initialized";
            return;
        }
        try {
            await this.player.togglePlay();
        } catch (error) {
            console.error("Failed to toggle play:", error);
            this.error = "Failed to control playback";
        }
    }

    public async playTrack(uri: string) {
        const deviceId = currentlyPlayingStore.getDeviceId;
        if (!deviceId) {
            this.error = "No active device found. Please refresh the page.";
            return;
        }

        try {
            const token = await spotifyAuthService.getAccessToken();
            const response = await fetch(
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error?.message || "Failed to play track"
                );
            }
            this.error = null;
        } catch (error) {
            console.error("Error playing track:", error);
            this.error =
                error instanceof Error ? error.message : "Failed to play track";
            throw error;
        }
    }

    render() {
        const currentTrack = currentlyPlayingStore.getCurrentTrack;
        const isPlaying = currentlyPlayingStore.getIsPlaying;

        return html`
            <div class="player-container">
                ${this.isInitializing
                    ? html`<div class="initializing">
                          Initializing Spotify player...
                      </div>`
                    : this.error
                      ? html`
                            <div class="error-message">
                                ${this.error}
                                <button @click=${this.initializePlayer}>
                                    Retry
                                </button>
                            </div>
                        `
                      : currentTrack
                        ? html`
                              <div class="track-info">
                                  <button
                                      class="play-button"
                                      @click=${this.togglePlay}
                                  >
                                      <div class="play-icon">
                                          ${isPlaying
                                              ? html`
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                                                        />
                                                    </svg>
                                                `
                                              : html`
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                        height="24"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            d="M8 5v14l11-7z"
                                                        />
                                                    </svg>
                                                `}
                                      </div>
                                  </button>
                                  <img
                                      src="${currentTrack.album.images[0]?.url}"
                                      alt="${currentTrack.album.name}"
                                      class="album-art"
                                  />
                                  <div class="track-details">
                                      <div class="track-name">
                                          ${currentTrack.name}
                                      </div>
                                      <div class="artist-name">
                                          ${currentTrack.artists
                                              .map((a) => a.name)
                                              .join(", ")}
                                      </div>
                                  </div>
                              </div>
                          `
                        : html`<div class="no-track">No track playing</div>`}
            </div>
        `;
    }
}
