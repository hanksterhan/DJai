import { css } from "lit";

export const styles = css`
    :host {
        display: block;
    }

    .dragging {
        opacity: 0.5;
    }

    .platform-row {
        background-color: #2d2d2d; /* Dark gray background */
    }

    sp-table-row {
        position: relative;
        background-color: #2d2d2d; /* Dark gray background */
    }

    /* More specific hover selector */
    sp-table-body sp-table-row:hover,
    sp-table-body sp-table-row:hover sp-table-cell,
    sp-table-body sp-table-row:hover platform-table-cell {
        background-color: #1a1a1a !important;
    }

    /* Selected row styling */
    sp-table-body sp-table-row.selected,
    sp-table-body sp-table-row.selected sp-table-cell,
    sp-table-body sp-table-row.selected platform-table-cell {
        background-color: #1a1a1a !important;
    }

    sp-table-row[draggable="true"] {
        cursor: move;
    }

    .loading-headers {
        width: 150px;
        height: 22px;
    }

    .loading-rows {
        width: 120px;
        height: 15px;
    }

    .loading-cell {
        background-color: #2d2d2d;
    }

    /* Remove or style table borders */
    sp-table {
        border-color: #2d2d2d !important;
    }

    sp-table-cell {
        border-color: #2d2d2d !important;
    }

    sp-table-head-cell {
        border-color: #2d2d2d !important;
    }

    /* Target all borders */
    sp-table,
    sp-table-body,
    sp-table-cell,
    sp-table-head-cell {
        border-top-color: #2d2d2d !important;
        border-bottom-color: #2d2d2d !important;
        border-left-color: #2d2d2d !important;
        border-right-color: #2d2d2d !important;
    }

    /* Round corners */
    sp-table-body {
        border-radius: 8px;
        overflow: hidden;
    }
`;
