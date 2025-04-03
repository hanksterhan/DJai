import { MenuStore } from "./MenuStore";
import { PlaylistStore } from "./PlaylistStore"
import { CurrentlyPlayingStore } from "./CurrentlyPlayingStore"
import { UserStore } from "./UserStore"
// PLOP: APPEND STORE IMPORTS

export const menuStore = new MenuStore();
export * from "./PlaylistStore";
export const playlistStore = new PlaylistStore();
export * from "./CurrentlyPlayingStore";
export const currentlyPlayingStore = new CurrentlyPlayingStore();
export * from "./UserStore";
export const userStore = new UserStore();
// PLOP: APPEND STORE EXPORTS   
