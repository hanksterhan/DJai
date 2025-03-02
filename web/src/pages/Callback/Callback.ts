import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";
import { menuStore } from "../../stores";

@customElement("callback-page")
export class Callback extends MobxLitElement {
    static readonly TAG_NAME = "callback-page";

    async connectedCallback() {
        super.connectedCallback();
        console.log("Callback component connected");

        // Get code and state from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        console.log("Auth code:", code, "State:", state);

        if (code && state) {
            try {
                console.log("Attempting callback to server...");
                await spotifyAuthService.handleCallback(code, state);
                console.log("Server callback successful");
                menuStore.setSelectedPage("home");
                console.log("Navigation requested to home");
            } catch (error) {
                console.error("Authentication failed:", error);
            }
        }
    }

    render() {
        return html`<div>Processing authentication...</div>`;
    }
}
