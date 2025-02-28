export const component = {
    description: "Automate creation of a component",
    prompts: [
        {
            type: "input",
            name: "name",
            default: "MyComponent",
            message:
                "What's the name of the Component? (e.g. RosterComponent, PlayerComponent)",
        },
    ],
    actions: [
        // add component file
        {
            type: "add",
            path: "{{>componentPath}}/{{>pascalName}}/{{>camelName}}.ts",
            templateFile: "plop/templates/component/component.hbs",
        },
        // add component index file
        {
            type: "add",
            path: "{{>componentPath}}/{{>pascalName}}/index.ts",
            templateFile: "plop/templates/component/index.hbs",
        },
        // add component css file
        {
            type: "add",
            path: "{{>componentPath}}/{{>pascalName}}/styles.css.ts",
            templateFile: "plop/templates/component/styles.hbs",
        },
        //update component index file for exports
        {
            type: "modify",
            path: "{{>componentPath}}/index.ts",
            pattern: /(\/\/ PLOP: APPEND COMPONENT EXPORTS)/g,
            templateFile: "plop/templates/component/componentExports.hbs",
        },
    ],
};
