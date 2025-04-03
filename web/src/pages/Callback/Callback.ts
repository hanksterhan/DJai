import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";
import { menuStore, userStore } from "../../stores";

@customElement("callback-page")
export class Callback extends MobxLitElement {
    static readonly TAG_NAME = "callback-page";

    async connectedCallback() {
        super.connectedCallback();

        // Get code and state from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (code && state) {
            try {
                await spotifyAuthService.handleCallback(code, state);

                // Explicitly set authenticated to true since we've successfully handled the callback
                userStore.setAuthenticated(true);

                // Also check auth status to ensure everything is in sync
                await userStore.checkAuthStatus();

                menuStore.setSelectedPage("home");
            } catch (error) {
                // Set error in userStore
                userStore.error =
                    error instanceof Error
                        ? error.message
                        : "Authentication failed";

                // Remove query parameters from URL
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );

                menuStore.setSelectedPage("error");
            }
        }
    }

    render() {
        return html`
            <div class="callback-container">
                <p>Processing authentication...</p>
            </div>
        `;
    }
}
