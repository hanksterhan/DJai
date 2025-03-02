import { Router } from "express";
import { spotifyRouter } from "./spotifyRouter";

const router = Router();

router.use("/api/spotify", spotifyRouter);

export default router;
