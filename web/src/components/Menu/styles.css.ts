import { css } from "lit";

export const styles = css`
    .header-bar {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #2d2d2d; /* Steel blue background */
        min-height: 48px;
        padding: 0 20px;
    }

    .logo {
        cursor: pointer;
        padding: 0 10px;
        margin-right: 20px;
    }

    .logo h2 {
        margin: 0;
        font-size: 24px;
        font-weight: bold;
        color: white;
    }

    sp-button {
        margin: 0 10px;
        --spectrum-button-m-text-size: 14px;
        --spectrum-button-m-text-line-height: 1.2;
        --spectrum-button-m-padding-y: 4px;
    }

    .menu-button {
        background-color: #2d2d2d; /* Steel blue background */
    }

    h2 {
        margin: 0;
        font-size: 18px;
        line-height: 1.2;
    }
`;
