import { MenuStore } from "./MenuStore";
import { PlaylistStore } from "./PlaylistStore"
// PLOP: APPEND STORE IMPORTS

export const menuStore = new MenuStore();
export * from "./PlaylistStore";
export const playlistStore = new PlaylistStore();
// PLOP: APPEND STORE EXPORTS 
