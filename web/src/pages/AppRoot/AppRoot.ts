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

    render() {
        return html`
            <sp-theme system="spectrum" color="light" scale="medium" dir="ltr">
                <app-menu></app-menu>
                <div>
                    ${menuStore.selectedPage === "teams"
                        ? html`<teams-page></teams-page>`
                        : ""}
                    ${menuStore.selectedPage === "leagues"
                        ? html`<leagues-page></leagues-page>`
                        : ""}
                    ${menuStore.selectedPage === "nba"
                        ? html`<fantasy-basketball></fantasy-basketball>`
                        : ""}
                    ${menuStore.selectedPage === "nfl"
                        ? html`<fantasy-football></fantasy-football>`
                        : ""}
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
