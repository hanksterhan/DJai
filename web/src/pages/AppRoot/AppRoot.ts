import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";

import "../index";

import { menuStore } from "../../stores/index";

@customElement("app-root")
export class AppRoot extends MobxLitElement {
    static readonly TAG_NAME = "app-root";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    selectedPage: string = menuStore.selectedPage;

    connectedCallback() {
        super.connectedCallback();
        this.handleRouting();
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
                ${menuStore.selectedPage !== "home" &&
                menuStore.selectedPage !== "callback"
                    ? html`<app-menu></app-menu>`
                    : ""}
                <div>
                    ${menuStore.selectedPage === "home"
                        ? html`<home-page></home-page>`
                        : ""}
                    ${menuStore.selectedPage === "callback"
                        ? html`<callback-page></callback-page>`
                        : ""}
                    <!-- ${menuStore.selectedPage === "teams"
                        ? html`<teams-page></teams-page>`
                        : ""} -->
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
