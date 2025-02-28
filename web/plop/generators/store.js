import path from "path";
import { existsSync } from "fs";
import { getDirectories } from "./utils.js";

const mobxStoreFolders = getDirectories(path.resolve("./src/stores"));

export const mobxStore = {
  description: "Automate creation of MobX State Store",
  prompts: [
    {
      type: "input",
      name: "name",
      default: "MyMobXStore",
      message:
        "What's the name of the MobX Store? (e.g. LeagueStore, YahooStore)",
    },
    {
      type: "confirm",
      name: "folder",
      message:
        "Would you like to add the MobX Store to an existing folder inside of /src/stores? (alternative is to add it to /src/stores)",
    },
    {
      type: "list",
      name: "folderName",
      choices: mobxStoreFolders,
      message: "Which folder will the MobX be added to?",
      when: ({ folder }) => folder,
    },
  ],
  actions: [
    // add Store file
    {
      type: "add",
      path: "{{>storePath}}/{{>pascalName}}/{{>camelName}}.ts",
      templateFile: "plop/templates/store/store.hbs",
    },
    // add Store index
    {
      type: "add",
      path: "{{>storePath}}/{{>pascalName}}/index.ts",
      templateFile: "plop/templates/store/index.hbs",
    },
    // update folder index file if applicable and exists
    {
      type: "modify",
      path: "{{>storePath}}/index.ts",
      pattern: /(\/\/ PLOP: APPEND STORE EXPORTS)/g,
      templateFile: "plop/templates/store/folderIndexExport.hbs",
    },
    // create folder index file if applicable and doesn't exist yet
    {
      type: "add",
      path: "{{>storePath}}/index.ts",
      templateFile: "plop/templates/store/folderIndex.hbs",
      skip: ({ folder, folderName }) => {
        if (!folder) return "SKIP: Store is not in a folder";
        const folderIndexPath = `./src/stores/${folderName}/index.ts`;
        const exists = existsSync(folderIndexPath);
        if (exists) return `SKIP: Folder index file already exists.`;
        return true;
      },
    },
    //update store index file for imports and exports
    {
      type: "modify",
      path: "src/stores/index.ts",
      pattern: /(\/\/ PLOP: APPEND STORE IMPORTS)/g,
      templateFile: "plop/templates/store/storeImports.hbs",
    },
    {
      type: "modify",
      path: "src/stores/index.ts",
      pattern: /(\/\/ PLOP: APPEND STORE EXPORTS)/g,
      templateFile: "plop/templates/store/storeExports.hbs",
    },
  ],
};
