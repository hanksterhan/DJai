import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";
import { spotifyService } from "../../services/spotifyService";
import { SpotifyPlaylist } from "@common/interfaces";

@customElement("home-page")
export class Home extends MobxLitElement {
    static readonly TAG_NAME = "home-page";

    @state()
    private isAuthenticated = false;

    @state()
    private playlists: SpotifyPlaylist[] = [];

    async connectedCallback() {
        super.connectedCallback();
        await this.checkAuthStatus();
    }

    async updated(changedProperties: Map<string, any>) {
        super.updated(changedProperties);
        // Recheck auth status when component becomes visible
        if (changedProperties.has("hidden") && !this.hidden) {
            await this.checkAuthStatus();
        }
    }

    private async checkAuthStatus() {
        const authStatus = await spotifyAuthService.getAuthStatus();
        this.isAuthenticated = authStatus.isAuthenticated;
    }

    private async handleLogin() {
        await spotifyAuthService.login();
    }

    private async handleGetPlaylists() {
        try {
            const response = await spotifyService.getPlaylists();
            this.playlists = response.items;
        } catch (error) {
            console.error("Failed to get playlists:", error);
        }
    }

    render() {
        return html`
            <div class="home-container">
                <h1>Welcome to DJai</h1>
                ${this.isAuthenticated
                    ? html`
                          <p>You're connected to Spotify!</p>
                          <sp-button
                              variant="primary"
                              @click=${this.handleGetPlaylists}
                          >
                              Get My Playlists
                          </sp-button>
                          ${this.playlists.length > 0
                              ? html`
                                    <div class="playlists">
                                        <h2>Your Playlists</h2>
                                        <ul>
                                            ${this.playlists.map(
                                                (playlist) => html`
                                                    <li>
                                                        ${playlist.name}
                                                        (${playlist.tracks
                                                            .total}
                                                        tracks)
                                                    </li>
                                                `
                                            )}
                                        </ul>
                                    </div>
                                `
                              : ""}
                      `
                    : html`
                          <p>Connect your Spotify account to get started</p>
                          <sp-button
                              variant="primary"
                              @click=${this.handleLogin}
                          >
                              Connect Spotify
                          </sp-button>
                      `}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [Home.TAG_NAME]: Home;
    }
}
