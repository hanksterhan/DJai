import { html, TemplateResult } from "lit";
import { styles } from "./styles.css";
import { customElement, property } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";

@customElement("platform-table-cell")
export class PlatformTableCell extends MobxLitElement {
    static readonly TAG_NAME = "platform-table-cell";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    variant: "grow" | "shrink" = "shrink";

    protected render(): TemplateResult {
        return html` <slot></slot> `;
    }
}
