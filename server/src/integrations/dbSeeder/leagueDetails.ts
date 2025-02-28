// import { LeagueInfo } from "@common/interfaces";
// import { yahoo } from "../yahoo";
// import db from "../../config/database";
// import { createValuesString } from "./utils";

// const insertLeague = db.prepare(
//     `INSERT OR REPLACE INTO leagues (
//         league_id,
//         name,
//         num_teams,
//         scoring_type,
//         sport,
//         season)
//     VALUES (${createValuesString(6)})`
// );

// // export async function ingestLeaguesDetailsToDb() {
// //     const leagueDetails: LeagueInfo[] = await yahoo.getUserLeagues();
// //     for (let i = 0; i < leagueDetails.length; i++) {
// //         insertLeague.run(
// //             leagueDetails[i].league_id,
// //             leagueDetails[i].name,
// //             leagueDetails[i].num_teams,
// //             leagueDetails[i].scoring_type,
// //             leagueDetails[i].sport,
// //             leagueDetails[i].season
// //         );
// //     }
// // }
