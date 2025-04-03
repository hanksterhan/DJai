import { Request, Response } from "express";
import { spotifyAuth } from "../integrations/spotify/spotifyAuth";
import { spotify } from "../integrations/spotify/spotify";

class SpotifyHandler {
    /**
     * Initiates the Spotify OAuth flow
     */
    handleLogin = async (_req: Request, res: Response) => {
        const authUrl = spotifyAuth.composeAuthUrl();
        res.json({ data: { url: authUrl } });
    };

    /**
     * Handles the OAuth callback from Spotify
     */
    handleCallback = async (req: Request, res: Response) => {
        const { code, state } = req.body;

        try {
            await spotifyAuth.requestAccessToken(code, state);
            res.json({ data: { success: true } });
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
            res.json({ data: { access_token: token } });
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
            res.json({ data: { isAuthenticated } });
        } catch (error) {
            console.error("Failed to get auth status:", error);
            res.status(500).json({ error: "Failed to get auth status" });
        }
    };

    /**
     * Gets the current user's playlists
     */
    getPlaylists = async (_req: Request, res: Response) => {
        try {
            const token = await spotifyAuth.getAccessToken();
            await spotify.setAccessToken(token);
            const playlists = await spotify.getUserPlaylists();
            res.json({ data: playlists });
        } catch (error) {
            console.error("Failed to get playlists:", error);
            res.status(500).json({ error: "Failed to get playlists" });
        }
    };

    /**
     * Gets the tracks from a specific playlist
     */
    getPlaylistTracks = async (req: Request, res: Response) => {
        try {
            const { playlistId } = req.params;
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 20;

            const token = await spotifyAuth.getAccessToken();
            await spotify.setAccessToken(token);

            const tracks = await spotify.getPlaylistTracks(
                playlistId,
                offset,
                limit
            );
            res.json({ data: tracks });
        } catch (error) {
            console.error("Failed to get playlist tracks:", error);
            res.status(500).json({ error: "Failed to get playlist tracks" });
        }
    };

    /**
     * Toggles debug mode to force token expiration
     */
    toggleDebugForceExpired = async (req: Request, res: Response) => {
        try {
            const { forceExpired } = req.body;
            if (typeof forceExpired !== "boolean") {
                return res
                    .status(400)
                    .json({ error: "forceExpired must be a boolean" });
            }

            spotifyAuth.setDebugForceExpired(forceExpired);
            res.json({
                data: {
                    debugForceExpired: spotifyAuth.getDebugForceExpired(),
                },
            });
        } catch (error) {
            console.error("Failed to toggle debug mode:", error);
            res.status(500).json({ error: "Failed to toggle debug mode" });
        }
    };
}

export const spotifyHandler = new SpotifyHandler();
