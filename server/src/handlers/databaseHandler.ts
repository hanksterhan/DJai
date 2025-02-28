// import { Request, Response } from "express";
// import db from "../config/database";
// import {
//     ingestLeaguesDetailsToDb,
//     ingestTeamDetailsToDb,
// } from "../integrations/dbSeeder";

// class DatabaseHandler {
//     getData = async (req: Request, res: Response) => {
//         const database = req.params.database;
//         try {
//             this.validateDatabase(database);
//         } catch (error) {
//             console.error(
//                 `Error: the database table ${database} does not exist.`
//             );
//         }

//         const data = db
//             .prepare(
//                 `
//             SELECT * FROM ${database}
//             `
//             )
//             .all();
//         res.status(200).json(data);
//     };

//     seedData = async (req: Request, res: Response) => {
//         const database = req.params.database;
//         this.validateDatabase(database);

//         switch (database) {
//             case "leagues":
//                 await ingestLeaguesDetailsToDb();
//                 break;
//             case "teams":
//                 await ingestTeamDetailsToDb();
//                 break;
//             default:
//                 console.log(`database ${database} not found`);
//                 break;
//         }

//         const data = db.prepare(`SELECT * FROM ${database} LIMIT 10`).all();

//         res.status(200).json(data);
//     };

//     validateDatabase(database: string) {
//         const tableExists = db
//             .prepare(
//                 `SELECT NAME from sqlite_master WHERE type='table' AND name='${database}'`
//             )
//             .get();

//         if (!tableExists) {
//             throw new Error(
//                 `Error: the database table ${database} does not exist.`
//             );
//         }
//     }
// }

// export const databaseHandler = new DatabaseHandler();
