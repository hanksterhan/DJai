import { IRouter, Router as defineRouter } from "express";
import { yahooHandler } from "../handlers";

function createRouter(): IRouter {
    const router = defineRouter();

    router.get("/yahoo/user-leagues", yahooHandler.getUserLeagues);
    return router;
}

export const yahooRouter = createRouter();
