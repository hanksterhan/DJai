import { css } from "lit";

export const styles = css`
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }

    .playlist-container {
        display: flex;
        width: 100%;
        height: 100%;
        gap: 20px;
    }

    .playlist-menu {
        width: 300px;
        border-right: 1px solid #ccc;
        padding-right: 20px;
        background-color: #4682b4; /* Steel blue background */
        padding: 20px;
        border-radius: 8px;
    }

    .playlist-table {
        background-color: #4682b4; /* Steel blue background */
        padding: 20px;
        border-radius: 8px;
        flex: 1;
    }

    .loading {
        opacity: 0.6;
    }
`;
