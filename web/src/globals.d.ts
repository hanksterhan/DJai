import { TemplateResult, nothing } from "lit-html";

export {};

declare global {
    type TemplateResultOrNothing =
        | TemplateResult
        | TemplateResult[]
        | typeof nothing;
}
