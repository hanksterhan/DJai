import { css } from "lit";

export const styles = css`
    .header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #2d2d2d; /* Steel blue background */
        min-height: 48px;
        padding: 0 20px;
    }

    .left-section {
        display: flex;
        align-items: center;
    }

    .right-section {
        display: flex;
        align-items: center;
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

    .menu-button {
        background-color: #2d2d2d;
        position: relative;
        margin: 0 10px;
        --spectrum-button-m-text-size: 14px;
        --spectrum-button-m-text-line-height: 1.2;
        --spectrum-button-m-padding-y: 4px;
    }

    .user-menu-button {
        background-color: #2d2d2d;
        padding: 0px;
    }

    .auth-button-container {
        position: relative;
    }

    .status-indicator {
        position: absolute;
        top: 40%;
        right: 0;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        animation: pulse 2s infinite;
        margin-right: -4px;
    }

    .status-indicator-success {
        background-color: #00ff00;
        box-shadow:
            0 0 5px #00ff00,
            0 0 10px #00ff00;
    }

    .status-indicator-error {
        background-color: #ff0000;
        box-shadow:
            0 0 5px #ff0000,
            0 0 10px #ff0000;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
        }
        70% {
            box-shadow: 0 0 0 5px rgba(0, 255, 0, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
        }
    }

    h2 {
        margin: 0;
        font-size: 18px;
        line-height: 1.2;
    }

    .user-menu-container {
        position: relative;
    }

    .user-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        z-index: 100;
    }

    .user-menu-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #818181;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 101;
        min-width: 150px;
        margin-top: 5px;
        padding: 8px 0;
    }

    .user-menu-dropdown sp-menu-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 8px 16px;
        cursor: pointer;
        color: white;
    }

    .user-menu-dropdown sp-menu-item:hover {
        background-color: #2d2d2d;
    }

    .user-menu-dropdown sp-icon-user sp-icon-settings sp-icon-logout {
        margin-right: 12px;
        color: white;
        margin-top: 3px; /* Push icons down to align with text */
    }

    .menu-item-text {
        color: white;
        padding-left: 12px;
    }
`;
