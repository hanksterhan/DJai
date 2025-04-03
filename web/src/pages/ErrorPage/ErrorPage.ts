import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";

import "../index";
import "../../components/index";
import { menuStore } from "../../stores/index";

@customElement("error-page")
export class ErrorPage extends MobxLitElement {
    static readonly TAG_NAME = "error-page";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    errorMessage: string = "An error occurred";

    @property({ type: String })
    errorCode: string = "500";

    private navigateToHome() {
        menuStore.setSelectedPage("home");
    }

    render() {
        return html`
            <div class="error-container">
                <div class="error-content">
                    <sp-icon-alert-circle
                        size="xl"
                        class="error-icon"
                    ></sp-icon-alert-circle>
                    <sp-button
                        variant="primary"
                        @click=${this.navigateToHome}
                        class="home-button"
                    >
                        Return to Home
                    </sp-button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        [ErrorPage.TAG_NAME]: ErrorPage;
    }
}
