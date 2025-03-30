import { css } from "lit";

export const styles = css`
    :host {
        display: flex;
        width: 100%;
        height: 100%;
        gap: 20px;
    }

    .playlist-menu {
        width: 300px;
        border-right: 1px solid #ccc;
    }

    .playlist-details {
        flex: 1;
        padding: 20px;
    }

    .loading {
        opacity: 0.6;
    }
`;
