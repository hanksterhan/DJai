import { IRouter, Router as defineRouter } from "express";
// import { databaseHandler } from "../handlers/databaseHandler";

function createRouter(): IRouter {
    const router = defineRouter();

    // router.get("/db/data/:database", databaseHandler.getData);
    // router.get("/db/seed/:database", databaseHandler.seedData);

    return router;
}

export const databaseRouter = createRouter();
