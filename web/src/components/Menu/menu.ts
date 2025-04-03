import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./styles.css";
import { reaction } from "mobx";
import { MobxLitElement } from "@adobe/lit-mobx";

import { menuStore } from "../../stores/index";

interface MenuItemDetails {
    id: string;
    name: string;
}

// id is internal, name is shown in menu
const MENU_ITEMS: MenuItemDetails[] = [{ id: "queue", name: "Queue" }];

@customElement("app-menu")
export class Menu extends MobxLitElement {
    static readonly TAG_NAME = "app-menu";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    selectedPage: string = menuStore.selectedPage;

    constructor() {
        super();
        reaction(
            () => menuStore.selectedPage,
            (selectedPage) => {
                this.selectedPage = selectedPage;
            }
        );
    }

    navigateTo(page: string) {
        menuStore.setSelectedPage(page);
    }

    generateMenuItem(itemDetails: MenuItemDetails): TemplateResult {
        return html` <sp-button
            size="xl"
            @click=${() => this.navigateTo(itemDetails.id)}
            class="menu-button"
        >
            <h2>${itemDetails.name}</h2>
        </sp-button>`;
    }

    render() {
        return html`
            <div class="header-bar">
                <div class="logo" @click=${() => this.navigateTo("home")}>
                    <h2>DJai</h2>
                </div>
                <sp-button-group>
                    ${MENU_ITEMS.map((menuItem: MenuItemDetails) => {
                        return this.generateMenuItem(menuItem);
                    })}
                </sp-button-group>
            </div>
        `;
    }
}
