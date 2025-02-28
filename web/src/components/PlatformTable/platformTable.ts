import { html, TemplateResult } from "lit";
import { styles } from "./styles.css";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { Header, Row, TableData, TableLoadingFormat } from "./tableInterfaces";

@customElement("platform-table")
export class PlatformTable extends MobxLitElement {
    static readonly TAG_NAME = "platform-table";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    customStyles: string = "";

    @property({ type: String })
    customRowStyles: string = "";

    @property()
    handleOnClick = (row: Row) => {};

    @property({ type: Boolean })
    isLoading = false;

    @property({ type: Object })
    loadingFormat: TableLoadingFormat = { headers: 5, rows: 3 };

    @property({ type: Object })
    data: TableData = {} as TableData;

    @property({ type: Boolean })
    draggable = false;

    @property({ type: Number })
    draggedRowIndex: number | null = null;

    @property({ type: Array })
    private previewRows: Row[] = [];

    private _sort(event: CustomEvent) {
        const { sortDirection, sortKey } = event.detail;

        if (this.data && this.data.rows) {
            const sortedRows = [...this.data.rows].sort((a, b) => {
                const firstCell =
                    a.cells.find((cell) => cell?.header === sortKey)?.value ??
                    "";
                const secondCell =
                    b.cells.find((cell) => cell?.header === sortKey)?.value ??
                    "";

                if (typeof firstCell === "string") {
                    return sortDirection === "asc"
                        ? firstCell.localeCompare(secondCell)
                        : secondCell.localeCompare(firstCell);
                } else {
                    if (sortDirection === "asc") {
                        return Number(firstCell) > Number(secondCell) ? 1 : -1;
                    } else {
                        return Number(firstCell) > Number(secondCell) ? -1 : 1;
                    }
                }
            });

            this.data.rows = sortedRows;
            this.requestUpdate();
        }
    }

    private onDragStart(e: DragEvent, index: number) {
        if (!this.draggable) return;

        this.draggedRowIndex = index;
        this.previewRows = [...this.data.rows];
        e.dataTransfer?.setData("text/plain", index.toString());

        // Hide the drag ghost image
        const dragGhost = document.createElement("div");
        dragGhost.style.opacity = "0";
        document.body.appendChild(dragGhost);
        e.dataTransfer?.setDragImage(dragGhost, 0, 0);
        setTimeout(() => document.body.removeChild(dragGhost), 0);
    }

    private onDragOver(e: DragEvent, index: number) {
        if (!this.draggable) return;

        e.preventDefault();
        if (this.draggedRowIndex === null || this.draggedRowIndex === index) {
            return;
        }

        // Update preview order
        const rowsCopy = [...this.previewRows];
        const [draggedRow] = rowsCopy.splice(this.draggedRowIndex, 1);
        rowsCopy.splice(index, 0, draggedRow);
        this.previewRows = rowsCopy;
        this.draggedRowIndex = index;
    }

    private onDragEnd() {
        if (!this.draggable) return;

        // Commit the preview order to the actual rows
        if (this.draggedRowIndex !== null) {
            this.data.rows = [...this.previewRows];
            this.dispatchEvent(
                new CustomEvent("rows-reordered", {
                    detail: { rows: this.data.rows },
                    bubbles: true,
                    composed: true,
                })
            );
        }
        this.draggedRowIndex = null;
    }

    private onDrop(e: DragEvent) {
        if (!this.draggable) return;
        e.preventDefault();
        // The actual reordering is handled in onDragEnd
    }

    renderLoadingTable() {
        const headers: number[] = Array(this.loadingFormat.headers).fill(1);
        const rows: number[] = Array(this.loadingFormat.rows).fill(1);

        const loadingHeaders = headers.map(
            (_head) =>
                html` <sp-table-cell class="loading-cell">
                    <platform-table-cell>
                        <div class="loading-headers"></div>
                    </platform-table-cell>
                </sp-table-cell>`
        );

        const loadingRows = rows.map(
            (_value, index) => html`
                <sp-table-row value=${`row${index}`}>
                    ${headers.map(
                        () =>
                            html`<sp-table-cell class="loading-cell">
                                <platform-table-cell>
                                    <div class="loading-rows"></div>
                                </platform-table-cell>
                            </sp-table-cell>`
                    )}
                </sp-table-row>
            `
        );

        return [loadingHeaders, loadingRows];
    }

    renderHeaders(): TemplateResult[] {
        return this.data.headers.map((header) => {
            return html`
                <sp-table-head-cell
                    ?sortable=${header.sort ? true : false}
                    .sortKey=${header.sort ?? ""}
                    style=${styleMap({
                        flex: header.flex ?? "1 1 0%",
                        "align-content": "end",
                    })}
                >
                    ${header.label}
                </sp-table-head-cell>
            `;
        });
    }

    renderRows(): TemplateResult[] {
        return this.data.rows.map((row: Row) => {
            return html`
                <style>
                    ${this.customRowStyles}
                </style>
                <sp-table-row @click=${() => this.handleOnClick(row)}>
                    ${this.data.headers.map((header: Header) => {
                        return html`<sp-table-cell
                            style=${styleMap({ flex: header.flex ?? "1 1 0%" })}
                            class=${row.cssClass ?? ""}
                        >
                            ${row.cells
                                .find((cell) => cell?.header === header.id)
                                ?.render()}</sp-table-cell
                        >`;
                    })}
                </sp-table-row>
            `;
        });
    }

    protected render(): TemplateResult {
        let headers: TemplateResult[] = [];

        if (this.isLoading) {
            [headers] = this.renderLoadingTable();
            return html`
                <style>
                    ${this.customStyles}
                </style>
                <sp-table @sorted=${this._sort}>
                    <sp-table-head>${headers}</sp-table-head>
                    <sp-table-body
                        >${this.renderLoadingTable()[1]}</sp-table-body
                    >
                </sp-table>
            `;
        }

        headers = this.renderHeaders();
        const displayRows =
            this.draggedRowIndex !== null ? this.previewRows : this.data.rows;

        return html`
            <style>
                ${this.customStyles}
            </style>
            <sp-table @sorted=${this._sort}>
                <sp-table-head>${headers}</sp-table-head>
                <sp-table-body>
                    ${displayRows.map(
                        (row, index) => html`
                            <style>
                                ${this.customRowStyles}
                            </style>
                            <sp-table-row
                                draggable=${this.draggable}
                                class=${this.draggedRowIndex === index
                                    ? "dragging"
                                    : ""}
                                @dragstart=${(e: DragEvent) =>
                                    this.onDragStart(e, index)}
                                @dragover=${(e: DragEvent) =>
                                    this.onDragOver(e, index)}
                                @dragend=${this.onDragEnd}
                                @drop=${this.onDrop}
                                @click=${() => this.handleOnClick(row)}
                            >
                                ${this.data.headers.map(
                                    (header: Header) =>
                                        html` <sp-table-cell
                                            style=${styleMap({
                                                flex: header.flex ?? "1 1 0%",
                                            })}
                                            class=${row.cssClass ?? ""}
                                        >
                                            ${row.cells
                                                .find(
                                                    (cell) =>
                                                        cell?.header ===
                                                        header.id
                                                )
                                                ?.render()}</sp-table-cell
                                        >`
                                )}
                            </sp-table-row>
                        `
                    )}
                </sp-table-body>
            </sp-table>
        `;
    }
}
