import {
    component,
    page,
    mobxStore,
    service,
} from "./plop/generators/index.js";

export default function (plop) {
    plop.setGenerator("Component", component);
    plop.setGenerator("Page", page);
    plop.setGenerator("MobX Store", mobxStore);
    plop.setGenerator("Service", service);

    plop.setPartial("pascalName", "{{pascalCase name}}"); // TitleCase
    plop.setPartial("camelName", "{{camelCase name}}"); // camelCase
    plop.setPartial("tagName", "{{kebabCase name}}"); // dash-case

    // helper to remove the word 'service' from the service name
    plop.setHelper("removeService", (value) => {
        return value.includes("Service") ? value.split("Service")[0] : value;
    });

    plop.setPartial("componentPath", "src/components");
    plop.setPartial("pagePath", "src/pages");
    plop.setPartial(
        "storePath",
        "{{#if folderName}}src/stores/{{folderName}}{{else}}src/stores{{/if}}"
    );
    plop.setPartial("servicePath", "src/services");
    plop.setPartial(
        "serviceNameUpper",
        "{{constantCase (removeService name)}}"
    );
    plop.setPartial("serviceNameLower", "{{snakeCase (removeService name)}}");
}
