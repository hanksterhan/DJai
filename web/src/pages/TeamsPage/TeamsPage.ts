import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";

import "../index";
import "../../components/index";

@customElement("teams-page")
export class TeamsPage extends MobxLitElement {
  static readonly TAG_NAME = "teams-page";
  static get styles() {
    return styles;
  }

  @property({ type: String })
  placeholderProperty: string = "";

  render() {
    return html`
        <h2>TeamsPage page</h2>
        <p>Welcome to the TeamsPage page</p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [TeamsPage.TAG_NAME]: TeamsPage;
  }
}
