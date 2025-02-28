import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://www.fantasypros.com/nfl";

const ENDPOINTS = {
    ROOKIE_RANKINGS: "/rankings/dynasty-rookies-rb.php",
    DYNASTY_HPPR_RANKINGS: "/rankings/half-point-ppr-cheatsheets.php",
    HPPR_RANKINGS: "/rankings/half-point-ppr-cheatsheets.php",
    HPPR_ADP: "/adp/half-point-ppr-overall.php",
    KICKER_ADP: "/adp/k.php",
    DEF_ADP: "/adp/dst.php",
};

class FantasyProsScraper {
    private folderPath = "../../../../../src/data/";

    constructor() {}

    private scrapeRankingsByURL = async (
        endpoint: string,
        fileName: string
    ) => {
        try {
            const { data } = await axios.get(`${BASE_URL}${endpoint}`);
            const $ = cheerio.load(data);

            let ecrData: any;

            $("script").each((_, element) => {
                const scriptContent = $(element).html();

                if (scriptContent && scriptContent.includes("var ecrData =")) {
                    const match = scriptContent.match(
                        /var ecrData = (\{[\s\S]*?\});/
                    );
                    if (match) {
                        ecrData = JSON.parse(match[1]);
                    }
                }
            });

            if (ecrData) {
                console.log(
                    `[Fantasy Pros Scraper] player data saved to ${fileName}.`
                );
                fs.writeFileSync(
                    `${path.resolve(
                        __dirname,
                        `${this.folderPath}${fileName}`
                    )}`,
                    JSON.stringify(ecrData.players, null, 2)
                );
            } else {
                console.log(
                    `[Fantasy Pros Scraper] player data not found for ${endpoint}.`
                );
            }
        } catch (error) {
            console.error("Error scraping data:", error);
        }
    };

    private scrapeAdpByUrl = async (endpoint: string, fileName: string) => {
        try {
            const { data } = await axios.get(`${BASE_URL}${endpoint}`);
            const $ = cheerio.load(data);

            const players: any[] = [];

            $("#data tbody tr").each((_, element) => {
                const rank = parseInt(
                    $(element).find("td:nth-child(1)").text().trim(),
                    10
                );
                const playerName = $(element)
                    .find("td:nth-child(2) .player-name")
                    .text()
                    .trim();
                const team = $(element)
                    .find("td:nth-child(2) small")
                    .first()
                    .text()
                    .trim();
                const byeWeek = parseInt(
                    $(element)
                        .find("td:nth-child(2) small")
                        .last()
                        .text()
                        .trim()
                        .replace(/[()]/g, ""),
                    10
                );
                const position = $(element)
                    .find("td:nth-child(3)")
                    .text()
                    .trim();
                const yahoo = parseInt(
                    $(element).find("td:nth-child(4)").text().trim(),
                    10
                );
                const sleeper = parseInt(
                    $(element).find("td:nth-child(5)").text().trim(),
                    10
                );
                const rtsports = parseInt(
                    $(element).find("td:nth-child(6)").text().trim(),
                    10
                );
                const avg = parseFloat(
                    $(element).find("td:nth-child(7)").text().trim()
                );

                players.push({
                    rank,
                    playerName,
                    team,
                    byeWeek,
                    position,
                    yahoo,
                    sleeper,
                    rtsports,
                    avg,
                });
            });

            console.log(
                `[Fantasy Pros Scraper] player data saved to ${fileName}.`
            );

            fs.writeFileSync(
                `${path.resolve(__dirname, `${this.folderPath}${fileName}`)}`,
                JSON.stringify(players, null, 2)
            );
        } catch (error) {
            console.error("Error scraping data:", error);
        }
    };

    private scrapeDefAdpByUrl = async (endpoint: string, fileName: string) => {
        try {
            const { data } = await axios.get(`${BASE_URL}${endpoint}`);
            const $ = cheerio.load(data);

            const players: any[] = [];

            $("#data tbody tr").each((_, element) => {
                const rank = parseInt(
                    $(element).find("td:nth-child(1)").text().trim(),
                    10
                );
                const player_name = $(element)
                    .find("td:nth-child(3)")
                    .text()
                    .trim()
                    .split("(")[0];
                const team = $(element)
                    .find("td:nth-child(3)")
                    .text()
                    .trim()
                    .split("(")[0];
                const bye_week = parseInt(
                    $(element)
                        .find("td:nth-child(3)")
                        .text()
                        .trim()
                        .split("(")[1]
                        .split(")")[0]
                );
                const position = "DST";
                const yahoo = parseInt(
                    $(element).find("td:nth-child(4)").text().trim(),
                    10
                );
                const sleeper = parseInt(
                    $(element).find("td:nth-child(5)").text().trim(),
                    10
                );
                const rtsports = parseInt(
                    $(element).find("td:nth-child(6)").text().trim(),
                    10
                );
                const avg = parseFloat(
                    $(element).find("td:nth-child(7)").text().trim()
                );

                players.push({
                    rank,
                    player_name,
                    team,
                    bye_week,
                    position,
                    yahoo,
                    sleeper,
                    rtsports,
                    avg,
                    tier: 1,
                    auction_price: 0,
                });
            });

            console.log(
                `[Fantasy Pros Scraper] player data saved to ${fileName}.`
            );

            fs.writeFileSync(
                `${path.resolve(__dirname, `${this.folderPath}${fileName}`)}`,
                JSON.stringify(players, null, 2)
            );
        } catch (error) {
            console.error("Error scraping data:", error);
        }
    };

    scrapeRookieRankings = async () => {
        await this.scrapeRankingsByURL(
            ENDPOINTS.ROOKIE_RANKINGS,
            "dynasty-rookie-rankings.json"
        );
    };

    scrapeDynastyHpprRankings = async () => {
        await this.scrapeRankingsByURL(
            ENDPOINTS.DYNASTY_HPPR_RANKINGS,
            "dynasty-hppr-rankings.json"
        );
    };

    scrapeHpprRankings = async () => {
        await this.scrapeRankingsByURL(
            ENDPOINTS.HPPR_RANKINGS,
            "hppr-rankings.json"
        );
    };

    scrapeAdpRankings = async () => {
        await this.scrapeAdpByUrl(ENDPOINTS.HPPR_ADP, "hppr-adp.json");
    };

    scrapeKickerAdpRankings = async () => {
        await this.scrapeAdpByUrl(ENDPOINTS.KICKER_ADP, "kicker-adp.json");
    };

    scrapeDefAdpRankings = async () => {
        await this.scrapeDefAdpByUrl(ENDPOINTS.DEF_ADP, "def-adp.json");
    };
}

export const fantasyProsScraper = new FantasyProsScraper();
