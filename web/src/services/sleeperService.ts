import { httpClient } from "./fetch";
import {
    SleeperLeagueDetails,
    SleeperNflStateResponse,
    SleeperTeamWithStats,
    SleeperUserDetails,
} from "@common/interfaces";

const SLEEPER_ENDPOINTS = {
    sleeperNflState: "/sleeper/state",
    sleeperUser: (username: string) => `/sleeper/username/${username}`,
    sleeperUserLeagues: (userId: string) => `/sleeper/leagues/${userId}`,
    sleeperUserTeams: (userId: string, leagueId: string, week: string) =>
        `/sleeper/${userId}/${leagueId}/${week}`,
};

export class SleeperService {
    constructor() {}

    async getNflState(): Promise<SleeperNflStateResponse> {
        const nflState: SleeperNflStateResponse = await httpClient.get(
            SLEEPER_ENDPOINTS.sleeperNflState
        );

        return nflState;
    }

    async getUserDetails(username: string): Promise<SleeperUserDetails> {
        const userDetails: SleeperUserDetails = await httpClient.get(
            SLEEPER_ENDPOINTS.sleeperUser(username)
        );

        return userDetails;
    }

    async getUserLeagues(userId: string): Promise<SleeperLeagueDetails[]> {
        const userLeagues: SleeperLeagueDetails[] = await httpClient.get(
            SLEEPER_ENDPOINTS.sleeperUserLeagues(userId)
        );

        return userLeagues;
    }

    async getUserTeams(
        userId: string,
        leagueId: string,
        week: string
    ): Promise<SleeperTeamWithStats> {
        const userTeam: SleeperTeamWithStats = await httpClient.get(
            SLEEPER_ENDPOINTS.sleeperUserTeams(userId, leagueId, week)
        );

        return userTeam;
    }
}
