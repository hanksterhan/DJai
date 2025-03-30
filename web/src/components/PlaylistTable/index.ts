export * from "./playlistTable";
import { PlaylistTable } from "./playlistTable";

const TAG_NAME = "playlist-table";

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, PlaylistTable);
}

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlaylistTable;
  }
}
