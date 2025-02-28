import db from "../../config/database";

interface LeagueId {
    league_id: string;
}

export function createValuesString(numVars: number): string {
    return Array(numVars).fill("?").join(", ");
}

export function getAllLeagueIds(): string[] {
    const data = db
        .prepare(`SELECT league_id FROM leagues`)
        .all() as unknown as LeagueId[];

    const leagueIds = data.map((league: LeagueId) => {
        return league.league_id;
    });

    return leagueIds;
}
