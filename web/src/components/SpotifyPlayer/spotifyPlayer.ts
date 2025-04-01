import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: any;
    }
}

@customElement("spotify-player")
export class SpotifyPlayer extends MobxLitElement {
    static readonly TAG_NAME = "spotify-player";
    static get styles() {
        return styles;
    }

    @state()
    private player: any = null;

    @state()
    private isPlaying: boolean = false;

    @state()
    private currentTrack: any = null;

    @state()
    private deviceId: string | null = null;

    @property({ type: String })
    placeholderProperty: string = "";

    connectedCallback() {
        super.connectedCallback();
        this.initializeSpotifyPlayer();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.player) {
            this.player.disconnect();
        }
    }

    private async transferPlaybackToDevice(deviceId: string) {
        try {
            const token = await spotifyAuthService.getAccessToken();
            const response = await fetch(
                "https://api.spotify.com/v1/me/player",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        device_ids: [deviceId],
                        play: true,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to transfer playback");
            }
        } catch (error) {
            console.error("Error transferring playback:", error);
        }
    }

    private async initializeSpotifyPlayer() {
        // Load the Spotify Web Playback SDK script
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = async () => {
            const token = await spotifyAuthService.getAccessToken();

            this.player = new window.Spotify.Player({
                name: "DJai Web Player",
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(token);
                },
                volume: 0.5,
            });

            // Error handling
            this.player.addListener(
                "initialization_error",
                ({ message }: { message: string }) => {
                    console.error("Failed to initialize:", message);
                }
            );

            this.player.addListener(
                "authentication_error",
                ({ message }: { message: string }) => {
                    console.error("Failed to authenticate:", message);
                }
            );

            this.player.addListener(
                "account_error",
                ({ message }: { message: string }) => {
                    console.error(
                        "Failed to validate Spotify account:",
                        message
                    );
                }
            );

            // Playback status updates
            this.player.addListener("player_state_changed", (state: any) => {
                if (state) {
                    this.isPlaying = !state.paused;
                    this.currentTrack = state.track_window.current_track;
                }
            });

            // Ready
            this.player.addListener(
                "ready",
                async ({ device_id }: { device_id: string }) => {
                    console.log("Ready with Device ID", device_id);
                    this.deviceId = device_id;
                    await this.player.activateElement(); // Activate the element for mobile support
                    await this.transferPlaybackToDevice(device_id);
                }
            );

            // Not Ready
            this.player.addListener(
                "not_ready",
                ({ device_id }: { device_id: string }) => {
                    console.log("Device ID has gone offline", device_id);
                    this.deviceId = null;
                }
            );

            // Connect to the player
            this.player.connect();
        };
    }

    private async togglePlay() {
        if (this.player) {
            await this.player.togglePlay();
        }
    }

    private async reconnectPlayer() {
        if (this.deviceId && this.player) {
            await this.player.connect();
            await this.transferPlaybackToDevice(this.deviceId);
        }
    }

    render() {
        return html`
            <div class="spotify-player">
                <div class="player-info">
                    ${this.currentTrack
                        ? html`
                              <img
                                  src="${this.currentTrack.album.images[0].url}"
                                  alt="${this.currentTrack.name}"
                                  class="album-art"
                              />
                              <div class="track-info">
                                  <h3>${this.currentTrack.name}</h3>
                                  <p>${this.currentTrack.artists[0].name}</p>
                              </div>
                          `
                        : html`
                              <div class="no-track">
                                  <p>No track playing</p>
                              </div>
                          `}
                </div>
                <div class="player-controls">
                    <button @click=${this.togglePlay}>
                        ${this.isPlaying ? "Pause" : "Play"}
                    </button>
                    ${!this.deviceId
                        ? html`
                              <button @click=${this.reconnectPlayer}>
                                  Reconnect
                              </button>
                          `
                        : ""}
                </div>
            </div>
        `;
    }
}
