// import { LeagueStandings } from "@common/interfaces";
// import { yahoo } from "../yahoo";
// import db from "../../config/database";
// import { createValuesString, getAllLeagueIds } from "./utils";

// const insertTeam = db.prepare(
//     `INSERT OR REPLACE INTO teams (
//         team_id,
//         league_id,
//         name,
//         url,
//         team_logo_url,
//         number_of_moves,
//         number_of_trades,
//         points_for,
//         points_against,
//         rank,
//         playoff_seed,
//         wins,
//         losses,
//         ties,
//         percentage,
//         draft_grade,
//         draft_recap_url,
//         manager_name,
//         manager_image_url)
//     VALUES (${createValuesString(19)})`
// );

// export async function ingestTeamDetailsToDb() {
//     const leagueIds = getAllLeagueIds();

//     // for each league:
//     for (let i = 0; i < leagueIds.length; i++) {
//         console.log(`Seeding all the teams from ${leagueIds[i]}`);
//         const leagueStandings: LeagueStandings =
//             await yahoo.getLeagueStandingsById(leagueIds[i]);
//         // for each team in the league:
//         for (let j = 0; j < leagueStandings.teams.length; j++) {
//             insertTeam.run(
//                 leagueStandings.teams[j].team_key,
//                 leagueStandings.league_key,
//                 leagueStandings.teams[j].name,
//                 leagueStandings.teams[j].url,
//                 leagueStandings.teams[j].team_logo_url,
//                 leagueStandings.teams[j].number_of_moves,
//                 leagueStandings.teams[j].number_of_trades,
//                 leagueStandings.teams[j].points_for,
//                 leagueStandings.teams[j].points_against,
//                 leagueStandings.teams[j].rank,
//                 leagueStandings.teams[j].playoff_seed,
//                 leagueStandings.teams[j].wins,
//                 leagueStandings.teams[j].losses,
//                 leagueStandings.teams[j].ties,
//                 leagueStandings.teams[j].percentage,
//                 leagueStandings.teams[j].draft_grade,
//                 leagueStandings.teams[j].draft_recap_url,
//                 leagueStandings.teams[j].manager.nickname,
//                 leagueStandings.teams[j].manager.image_url
//             );
//         }
//     }
// }
