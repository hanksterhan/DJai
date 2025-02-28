import path from "path";
import Database from "better-sqlite3";

const dbFilePath = path.resolve(__dirname, "../../../../src/data/database.db");
const db = new Database(dbFilePath, { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS leagues (
        league_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        num_teams INTEGER NOT NULL,
        scoring_type TEXT NOT NULL,
        sport TEXT NOT NULL,
        season INTEGER NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
        team_id TEXT PRIMARY KEY,
        league_id TEXT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        team_logo_url TEXT NOT NULL,
        number_of_moves INTEGER NOT NULL,
        number_of_trades INTEGER NOT NULL,
        points_for INTEGER NOT NULL,
        points_against INTEGER NOT NULL,
        rank INTEGER NOT NULL,
        playoff_seed INTEGER NOT NULL,
        wins INTEGER NOT NULL,
        losses INTEGER NOT NULL,
        ties INTEGER NOT NULL,
        percentage REAL NOT NULL,
        draft_grade TEXT NOT NULL,
        draft_recap_url TEXT NOT NULL,
        manager_name TEXT NOT NULL,
        manager_image_url TEXT NOT NULL,
        FOREIGN KEY (league_id) REFERENCES leagues(league_id)
    )
`);

export default db;
