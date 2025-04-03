import { IRouter, Router as defineRouter } from "express";
import { spotifyHandler } from "../handlers";

function createRouter(): IRouter {
    const router = defineRouter();

    // Authentication endpoints
    router.get("/login", spotifyHandler.handleLogin);
    router.post("/callback", spotifyHandler.handleCallback);
    router.get("/token", spotifyHandler.getAccessToken);
    router.get("/auth-status", spotifyHandler.getAuthStatus);
    router.get("/playlists", spotifyHandler.getPlaylists);

    // Debug endpoints
    router.post("/debug/force-expired", spotifyHandler.toggleDebugForceExpired);

    // Playlist endpoints
    router.get(
        "/playlists/:playlistId/tracks",
        spotifyHandler.getPlaylistTracks
    );

    return router;
}

export const spotifyRouter = createRouter();
