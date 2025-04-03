import { html, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "./styles.css";
import { reaction, autorun } from "mobx";
import { MobxLitElement } from "@adobe/lit-mobx";

import { menuStore, userStore } from "../../stores/index";

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

    @state()
    private isUserMenuOpen = false;

    @state()
    private hasAuthError = false;

    private disposer: (() => void) | null = null;

    constructor() {
        super();
        reaction(
            () => menuStore.selectedPage,
            (selectedPage) => {
                this.selectedPage = selectedPage;
            }
        );

        // Set up a more robust reaction to userStore.error
        this.disposer = autorun(() => {
            this.hasAuthError = !!userStore.error;
            this.requestUpdate();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up the autorun when the component is disconnected
        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }
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

    private toggleUserMenu() {
        this.isUserMenuOpen = !this.isUserMenuOpen;
    }

    private closeUserMenu() {
        this.isUserMenuOpen = false;
    }

    render() {
        return html`
            <div class="header-bar">
                <div class="left-section">
                    <div class="logo" @click=${() => this.navigateTo("home")}>
                        <h2>DJai</h2>
                    </div>
                    <sp-button-group>
                        ${MENU_ITEMS.map((menuItem: MenuItemDetails) => {
                            return this.generateMenuItem(menuItem);
                        })}
                    </sp-button-group>
                </div>
                <div class="right-section">
                    ${userStore.isLoading
                        ? html`<sp-progress-circle
                              size="small"
                          ></sp-progress-circle>`
                        : userStore.isAuthenticated
                          ? html`
                                <div class="user-menu-container">
                                    <sp-button
                                        @click=${this.toggleUserMenu}
                                        aria-expanded=${this.isUserMenuOpen}
                                        class="user-menu-button"
                                    >
                                        <sp-icon-user></sp-icon-user>
                                        <span
                                            class="status-indicator status-indicator-success"
                                        ></span>
                                    </sp-button>

                                    ${this.isUserMenuOpen
                                        ? html`
                                              <div
                                                  class="user-menu-overlay"
                                                  @click=${this.closeUserMenu}
                                              ></div>
                                              <div class="user-menu-dropdown">
                                                  <sp-menu-item>
                                                      <sp-icon-user></sp-icon-user>
                                                      <span
                                                          class="menu-item-text"
                                                      >
                                                          Profile
                                                      </span>
                                                  </sp-menu-item>
                                                  <sp-menu-item>
                                                      <sp-icon-settings></sp-icon-settings>
                                                      <span
                                                          class="menu-item-text"
                                                      >
                                                          Settings
                                                      </span>
                                                  </sp-menu-item>
                                                  <sp-menu-item>
                                                      <sp-icon-log-out></sp-icon-log-out>
                                                      <span
                                                          class="menu-item-text"
                                                      >
                                                          Logout
                                                      </span>
                                                  </sp-menu-item>
                                              </div>
                                          `
                                        : ""}
                                </div>
                            `
                          : html`
                                <div class="auth-button-container">
                                    <sp-button
                                        class="menu-button"
                                        @click=${() => userStore.login()}
                                    >
                                        Connect to Spotify
                                    </sp-button>
                                    ${this.hasAuthError
                                        ? html`<span
                                              class="status-indicator status-indicator-error"
                                          ></span>`
                                        : ""}
                                </div>
                            `}
                </div>
            </div>
        `;
    }
}
