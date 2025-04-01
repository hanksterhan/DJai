import { MenuStore } from "./MenuStore";
import { PlaylistStore } from "./PlaylistStore"
import { CurrentlyPlayingStore } from "./CurrentlyPlayingStore"
// PLOP: APPEND STORE IMPORTS

export const menuStore = new MenuStore();
export * from "./PlaylistStore";
export const playlistStore = new PlaylistStore();
export * from "./CurrentlyPlayingStore";
export const currentlyPlayingStore = new CurrentlyPlayingStore();
// PLOP: APPEND STORE EXPORTS  
