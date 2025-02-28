import { Request, Response, NextFunction } from "express";

const PATHS_TO_SKIP = [
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
];

export async function apiLogger(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Skip logging for certain paths
    if (PATHS_TO_SKIP.includes(req.path)) {
        next();
        return;
    }

    const apiMetadata = `API Logger: ${req.method} ${req.originalUrl}`;
    console.info(apiMetadata);
    console.info(`    body: ${JSON.stringify(req.body)}`);
    const startTime = new Date();

    res.on("finish", () => {
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        console.info(`${apiMetadata} completed in ${duration}ms \n`);
    });

    next();
}
