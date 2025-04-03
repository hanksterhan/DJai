import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { reaction } from "mobx";

import "../index";
import { menuStore, userStore } from "../../stores/index";

@customElement("app-root")
export class AppRoot extends MobxLitElement {
    static readonly TAG_NAME = "app-root";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    selectedPage: string = menuStore.selectedPage;

    @state()
    private errorMessage: string = "";

    @state()
    private errorCode: string = "500";

    private disposer: (() => void) | null = null;

    connectedCallback() {
        super.connectedCallback();
        this.handleRouting();

        // Set up a reaction to userStore.error
        this.disposer = reaction(
            () => userStore.error,
            (error) => {
                if (error) {
                    this.errorMessage = error;
                    this.errorCode = "401";

                    // Only route to error page if we're not already on a specific page
                    // or if we're on the home page and not authenticated
                    if (
                        menuStore.selectedPage === "home" &&
                        !userStore.isAuthenticated
                    ) {
                        menuStore.setSelectedPage("error");
                    }
                }
            }
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }
    }

    private handleRouting() {
        // Check if we're on the callback path
        if (window.location.pathname === "/callback") {
            console.log("Setting page to callback");
            menuStore.setSelectedPage("callback");
        }
    }

    render() {
        console.log("Current selected page:", menuStore.selectedPage);

        return html`
            <sp-theme system="spectrum" color="light" scale="medium" dir="ltr">
                <app-menu></app-menu>
                <div class="main-content">
                    ${menuStore.selectedPage === "home"
                        ? html`<home-page></home-page>`
                        : ""}
                    ${menuStore.selectedPage === "callback"
                        ? html`<callback-page></callback-page>`
                        : ""}
                    ${menuStore.selectedPage === "queue"
                        ? html`<queue-page></queue-page>`
                        : ""}
                    ${menuStore.selectedPage === "error"
                        ? html`<error-page
                              errorMessage=${this.errorMessage}
                              errorCode=${this.errorCode}
                          ></error-page>`
                        : ""}
                    <!-- ${menuStore.selectedPage === "teams"
                        ? html`<teams-page></teams-page>`
                        : ""} -->
                </div>
                <div class="player-container">
                    <spotify-player></spotify-player>
                </div>
            </sp-theme>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [AppRoot.TAG_NAME]: AppRoot;
    }
}
