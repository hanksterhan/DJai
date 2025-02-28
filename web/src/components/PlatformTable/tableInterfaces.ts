import { html } from "lit";

export type TableLoadingFormat = {
    headers: number;
    rows: number;
};

export type Header = {
    id: string;
    label: string;
    flex?: string;
    sort?: string;
};

export type Cell = {
    header: string;
    value?: string;
    render: () => TemplateResultOrNothing;
};

export type Row = {
    rowId: number;
    cells: Cell[];
    cssClass?: string;
};

export type TableData = {
    headers: Header[];
    rows: Row[];
};

export const setFlex = (grow: number, shrink: number, basis: string) =>
    `${grow} ${shrink} ${basis}`;

export function generateHeader(
    label: string,
    colWidth: number,
    sort?: boolean
): Header {
    return {
        id: label.replaceAll(" ", "_").toLowerCase(),
        label: label,
        flex: setFlex(1, 0, `${colWidth}%`),
        sort: sort ? label.replaceAll(" ", "_").toLowerCase() : null,
    } as Header;
}

export function generateCell(header: string, value: string | number): Cell {
    return {
        header,
        value: value === "N/A" ? 999 : value,
        render: () => {
            return value === "N/A" ? html`&ndash;` : html`${value}`;
        },
    } as Cell;
}
