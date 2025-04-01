export * from "./playlistMenu";
import { PlaylistMenu } from "./playlistMenu";

const TAG_NAME = "playlist-menu";

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, PlaylistMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlaylistMenu;
  }
}
