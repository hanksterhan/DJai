import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";
import { playlistStore } from "../../stores/PlaylistStore/playlistStore";
import { styles } from "./styles.css";

@customElement("home-page")
export class Home extends MobxLitElement {
    static readonly TAG_NAME = "home-page";
    static get styles() {
        return styles;
    }

    @state()
    private isAuthenticated = false;

    @state()
    private isLoading = true;

    @state()
    private error: string | null = null;

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
        try {
            this.isLoading = true;
            this.error = null;
            const authStatus = await spotifyAuthService.getAuthStatus();
            this.isAuthenticated = authStatus.isAuthenticated;

            if (this.isAuthenticated) {
                // Load playlists if authenticated
                await playlistStore.fetchPlaylists();
            }
        } catch (error) {
            console.error("Failed to check auth status:", error);
            this.isAuthenticated = false;
            this.error =
                error instanceof Error
                    ? error.message
                    : "Failed to check authentication status";
        } finally {
            this.isLoading = false;
        }
    }

    private async handleLogin() {
        await spotifyAuthService.login();
    }

    render() {
        if (this.isLoading) {
            return html`
                <div class="home-container">
                    <p>Loading...</p>
                </div>
            `;
        }

        if (this.error) {
            return html`
                <div class="home-container">
                    <p class="error">${this.error}</p>
                    <sp-button variant="primary" @click=${this.handleLogin}>
                        Connect Spotify
                    </sp-button>
                </div>
            `;
        }

        return html`
            <div class="home-container">
                ${this.isAuthenticated
                    ? html`
                          <p>You're connected to Spotify!</p>
                          ${playlistStore.isLoading
                              ? html`<p>Loading playlists...</p>`
                              : playlistStore.error
                                ? html`<p class="error">
                                      ${playlistStore.error}
                                  </p>`
                                : html`<playlist-table></playlist-table>`}
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
