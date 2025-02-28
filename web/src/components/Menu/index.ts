export * from "./menu";
import { Menu } from "./menu";

const TAG_NAME = "app-menu";

if (!customElements.get(TAG_NAME)) {
    customElements.define(TAG_NAME, Menu);
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: Menu;
    }
}
