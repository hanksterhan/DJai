import { httpClient } from "./fetch";
import { LeagueDetails, LeagueInfo, LeagueStandings } from "@common/interfaces";

const YAHOO_ENDPOINTS = {
    userLeagues: "/yahoo/user-leagues",
    leagueInfo: (leagueId: string) => `/yahoo/league/${leagueId}`,
    leagueStandings: (leagueId: string) =>
        `/yahoo/league/standings/${leagueId}`,
    roster: "/yahoo/roster",
};

export class YahooService {
    constructor() {}

    async getUserLeagues(): Promise<LeagueInfo[]> {
        const userLeagues = await httpClient.get(YAHOO_ENDPOINTS.userLeagues);

        return userLeagues;
    }

    async getLeagueById(leagueId: string): Promise<LeagueDetails> {
        const leagueDetails = await httpClient.get(
            YAHOO_ENDPOINTS.leagueInfo(leagueId)
        );

        return leagueDetails;
    }

    async getLeagueStandingsById(leagueId: string): Promise<LeagueStandings> {
        const leagueStandings = await httpClient.get(
            YAHOO_ENDPOINTS.leagueStandings(leagueId)
        );

        return leagueStandings;
    }
}
