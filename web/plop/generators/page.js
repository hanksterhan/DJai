export const page = {
    description: "Automate creation of a page",
    prompts: [
        {
            type: "input",
            name: "name",
            default: "MyPage",
            message:
                "What's the name of the Page? (e.g. LeaguePage, RosterPage)",
        },
    ],
    actions: [
        // add page file
        {
            type: "add",
            path: "{{>pagePath}}/{{>pascalName}}/{{>pascalName}}.ts",
            templateFile: "plop/templates/page/page.hbs",
        },
        // add page index file
        {
            type: "add",
            path: "{{>pagePath}}/{{>pascalName}}/index.ts",
            templateFile: "plop/templates/page/index.hbs",
        },
        // add page css file
        {
            type: "add",
            path: "{{>pagePath}}/{{>pascalName}}/styles.css.ts",
            templateFile: "plop/templates/page/styles.hbs",
        },
        //update page index file for exports
        {
            type: "modify",
            path: "{{>pagePath}}/index.ts",
            pattern: /(\/\/ PLOP: APPEND PAGE EXPORTS)/g,
            templateFile: "plop/templates/page/pageExports.hbs",
        },
    ],
};
