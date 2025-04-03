import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { playlistStore } from "../../stores/PlaylistStore/playlistStore";
import { userStore } from "../../stores/UserStore/userStore";
import { styles } from "./styles.css";

@customElement("home-page")
export class Home extends MobxLitElement {
    static readonly TAG_NAME = "home-page";
    static get styles() {
        return styles;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadData();
    }

    async updated(changedProperties: Map<string, any>) {
        super.updated(changedProperties);
        // Reload data when component becomes visible
        if (changedProperties.has("hidden") && !this.hidden) {
            await this.loadData();
        }
    }

    private async loadData() {
        if (userStore.isAuthenticated) {
            // Load playlists if authenticated
            await playlistStore.fetchPlaylists();
        }
    }

    render() {
        if (userStore.isLoading) {
            return html`
                <div class="home-container">
                    <p>Loading...</p>
                </div>
            `;
        }

        if (userStore.error) {
            return html`
                <div class="home-container">
                    <p class="error">${userStore.error}</p>
                </div>
            `;
        }

        return html`
            <div class="home-container">
                ${userStore.isAuthenticated
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
