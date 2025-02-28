import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import * as routers from "./routes";
import { apiLogger, errorHandler } from "./middlewares";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use(express.json());
app.use(apiLogger);

Object.values(routers).forEach((router) => {
    app.use(router);
});

app.get("*", (_, res) => {
    res.setHeader("Cache-Control", "public, no-store");
    res.sendFile(path.resolve(__dirname, "../../../../web/public/index.html"));
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
