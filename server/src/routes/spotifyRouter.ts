import { IRouter, Router as defineRouter } from "express";
import { spotifyHandler } from "../handlers";

function createRouter(): IRouter {
    const router = defineRouter();

    // Authentication endpoints
    router.get("/login", spotifyHandler.handleLogin);
    router.get("/callback", spotifyHandler.handleCallback);

    // Token management endpoints
    router.get("/token", spotifyHandler.getAccessToken);
    router.get("/auth-status", spotifyHandler.getAuthStatus);

    return router;
}

export const spotifyRouter = createRouter();
