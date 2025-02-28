import { css } from "lit";

export const styles = css`
    :host {
        display: block;
    }

    .dragging {
        opacity: 0.5;
    }

    sp-table-row {
        position: relative;
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
        background-color: var(--spectrum-gray-100);
    }
`;
