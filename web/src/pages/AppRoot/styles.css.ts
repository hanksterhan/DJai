import { css } from "lit";

export const styles = css`
    sp-theme {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: var(--spectrum-blue-300);
        position: relative;
    }

    .main-content {
        flex: 1;
        overflow-y: auto;
        padding-bottom: 100px; /* Add padding to prevent content from being hidden behind the player */
    }

    .player-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
        padding: 16px;
    }

    .tabs-container {
        padding: 1rem;
        background-color: var(--spectrum-global-color-gray-50);
        border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    }
`;
