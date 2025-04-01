import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";
import { currentlyPlayingStore } from "../../stores/CurrentlyPlayingStore/currentlyPlayingStore";

declare global {
    interface Window {
        Spotify: {
            Player: new (config: any) => any;
        };
        onSpotifyWebPlaybackSDKReady: () => void;
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

    async firstUpdated() {
        await this.initializePlayer();
    }

    private async initializePlayer() {
        this.player = new window.Spotify.Player({
            name: "DJai Web Player",
            getOAuthToken: (cb: (token: string) => void) => {
                spotifyAuthService.getAccessToken().then((token) => cb(token));
            },
            volume: 0.5,
        });

        this.player.addListener(
            "ready",
            ({ device_id }: { device_id: string }) => {
                console.log("Ready with Device ID", device_id);
                currentlyPlayingStore.setDeviceId(device_id);
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

        await this.player.connect();
    }

    public async togglePlay() {
        if (!this.player) return;
        await this.player.togglePlay();
    }

    public async playTrack(uri: string) {
        const deviceId = currentlyPlayingStore.getDeviceId;
        if (!deviceId) {
            console.error("No device ID available");
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
                throw new Error("Failed to play track");
            }
        } catch (error) {
            console.error("Error playing track:", error);
            throw error;
        }
    }

    render() {
        const currentTrack = currentlyPlayingStore.getCurrentTrack;
        const isPlaying = currentlyPlayingStore.getIsPlaying;

        return html`
            <div class="player-container">
                ${currentTrack
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
                                                    <path d="M8 5v14l11-7z" />
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
                    : html` <div class="no-track">No track playing</div> `}
            </div>
        `;
    }
}
