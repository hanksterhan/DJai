export * from "./playlistTracks";
import { PlaylistTracks } from "./playlistTracks";

const TAG_NAME = "playlist-tracks";

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, PlaylistTracks);
}

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: PlaylistTracks;
  }
}
