import { Request, Response } from "express";
import { spotifyAuth } from "../integrations/spotify/spotifyAuth";

class SpotifyHandler {
    /**
     * Initiates the Spotify OAuth flow
     */
    handleLogin = async (_req: Request, res: Response) => {
        const composedAuthUrl = spotifyAuth.composeAuthUrl();
        res.redirect(composedAuthUrl);
    };

    /**
     * Handles the OAuth callback from Spotify
     */
    handleCallback = async (req: Request, res: Response) => {
        const authCode = req.query.code as string;
        const state = req.query.state as string;

        try {
            await spotifyAuth.requestAccessToken(authCode, state);
            res.redirect("/"); // Redirect to frontend after successful auth
        } catch (error) {
            console.error("Authentication callback failed:", error);
            res.status(500).json({ error: "Authentication failed" });
        }
    };

    /**
     * Returns the current access token if valid, or refreshes if needed
     */
    getAccessToken = async (_req: Request, res: Response) => {
        try {
            const token = await spotifyAuth.getAccessToken();
            res.json({ access_token: token });
        } catch (error) {
            console.error("Failed to get access token:", error);
            res.status(500).json({ error: "Failed to get access token" });
        }
    };

    /**
     * Returns the current authentication status
     */
    getAuthStatus = async (_req: Request, res: Response) => {
        try {
            const isAuthenticated = await spotifyAuth.isAuthenticated();
            res.json({ isAuthenticated });
        } catch (error) {
            console.error("Failed to get auth status:", error);
            res.status(500).json({ error: "Failed to get auth status" });
        }
    };
}

export const spotifyHandler = new SpotifyHandler();
