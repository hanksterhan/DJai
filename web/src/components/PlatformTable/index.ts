export * from "./platformTable";
export * from "./tableInterfaces";
import { PlatformTable } from "./platformTable";

const TAG_NAME = "platform-table";

if (!customElements.get(TAG_NAME)) {
    customElements.define(TAG_NAME, PlatformTable);
}

declare global {
    interface HTMLElementTagNameMap {
        [TAG_NAME]: PlatformTable;
    }
}
