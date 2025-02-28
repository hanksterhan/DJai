export const service = {
  description: "Automate creation of a resource retreival service",
  prompts: [
    {
      type: "input",
      name: "name",
      default: "MyService",
      message:
        "What's the name of the Service? (e.g. LeagueService, RosterService)",
    },
  ],
  actions: [
    // add Service file
    {
      type: "add",
      path: "{{>servicePath}}/{{>camelName}}.ts",
      templateFile: "plop/templates/service/service.hbs",
    },
    //update service index file for imports and exports
    {
      type: "modify",
      path: "{{>servicePath}}/index.ts",
      pattern: /(\/\/ PLOP: APPEND SERVICE IMPORTS)/g,
      templateFile: "plop/templates/service/serviceImports.hbs",
    },
    {
      type: "modify",
      path: "{{>servicePath}}/index.ts",
      pattern: /(\/\/ PLOP: APPEND SERVICE EXPORTS)/g,
      templateFile: "plop/templates/service/serviceExports.hbs",
    },
  ],
};
