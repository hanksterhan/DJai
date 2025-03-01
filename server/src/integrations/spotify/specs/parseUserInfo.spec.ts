// // import { parsePlayerLeagues } from "../parseUserInfo";
// // import { mockUserHistoryResponse, parsedUserHistory } from "./mockUserInfo";
// import { PlayerLeagues } from "@common/interfaces";

// describe("Parse User Info", () => {
//     it("should parse game information correctly", () => {
//         const result: PlayerLeagues[] = parsePlayerLeagues(
//             mockUserHistoryResponse
//         );

//         expect(result).toEqual(parsedUserHistory);
//     });

//     it("should handle multiple users correctly", () => {
//         const mockResponseWithMultipleUsers = JSON.parse(
//             JSON.stringify(mockUserHistoryResponse)
//         );
//         mockResponseWithMultipleUsers.fantasy_content.users["1"] =
//             mockResponseWithMultipleUsers.fantasy_content.users["0"];

//         const result: PlayerLeagues[] = parsePlayerLeagues(
//             mockResponseWithMultipleUsers
//         );

//         expect(result).toEqual(parsedUserHistory);
//     });

//     it("should handle games array or single object correctly", () => {
//         const mockResponseWithSingleGameObject = JSON.parse(
//             JSON.stringify(mockUserHistoryResponse)
//         );
//         mockResponseWithSingleGameObject.fantasy_content.users[
//             "0"
//         ].user[1].games["2"].game = [
//             mockResponseWithSingleGameObject.fantasy_content.users["0"].user[1]
//                 .games["2"].game,
//         ];

//         const result: PlayerLeagues[] = parsePlayerLeagues(
//             mockResponseWithSingleGameObject
//         );

//         expect(result).toEqual(parsedUserHistory);
//     });

//     it("should handle empty response gracefully", () => {
//         const emptyResponse = {
//             fantasy_content: {
//                 users: {
//                     count: 0,
//                 },
//             },
//         };

//         const result: PlayerLeagues[] = parsePlayerLeagues(
//             emptyResponse as any
//         );

//         expect(result).toEqual([]);
//     });
// });
