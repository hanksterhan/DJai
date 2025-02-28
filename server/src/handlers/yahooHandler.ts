import { Request, Response } from "express";
// import { yahoo } from "../integrations";
// import { LeagueInfo } from "@common/interfaces";

class YahooHandler {
    getUserLeagues = async (_req: Request, res: Response) => {
        // const response: LeagueInfo[] = await yahoo.getUserLeagues();
        const response = {};
        res.status(200).json(response);
    };
}

export const yahooHandler = new YahooHandler();
