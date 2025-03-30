import { html, CSSResult, TemplateResult } from "lit";

export interface Header {
    id: string;
    label: string;
    sort?: string;
    flex?: string;
}

export interface Cell {
    header: string;
    value: string;
    render: () => TemplateResult;
}

export interface Row {
    id: string;
    cells: Cell[];
    cssClass?: string;
}

export interface TableData {
    headers: Header[];
    rows: Row[];
}

export interface TableLoadingFormat {
    headers: number;
    rows: number;
}

export function setFlex(grow: number, shrink: number, basis: string): string {
    return `${grow} ${shrink} ${basis}`;
}

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

export interface PlatformTableProps {
    data: TableData;
    isLoading: boolean;
    handleOnClick?: (row: Row) => void | Promise<void>;
    customStyles?: string | CSSResult;
}
