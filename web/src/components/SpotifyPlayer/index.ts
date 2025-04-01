export * from "./spotifyPlayer";
import { SpotifyPlayer } from "./spotifyPlayer";

const TAG_NAME = "spotify-player";

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, SpotifyPlayer);
}

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: SpotifyPlayer;
  }
}
