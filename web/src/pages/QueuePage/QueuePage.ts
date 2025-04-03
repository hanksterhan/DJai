import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";

import "../index";
import "../../components/index";

@customElement("queue-page")
export class QueuePage extends MobxLitElement {
    static readonly TAG_NAME = "queue-page";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    placeholderProperty: string = "";

    render() {
        return html`
            <h2>QueuePage page</h2>
            <p>Welcome to the QueuePage page</p>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [QueuePage.TAG_NAME]: QueuePage;
    }
}
