export * from "./platformTableCell";
import { PlatformTableCell } from "./platformTableCell";

const TAG_NAME = "platform-table-cell";

if (!customElements.get(TAG_NAME)) {
    customElements.define(TAG_NAME, PlatformTableCell);
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: PlatformTableCell;
    }
}
