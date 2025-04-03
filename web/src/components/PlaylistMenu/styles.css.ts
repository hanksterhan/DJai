import { css } from "lit";

export const styles = css`
    :host {
        display: block;
        width: 300px;
    }

    .playlist-menu {
        border-right: 1px solid #ccc;
        padding-right: 20px;
        background-color: #4682b4; /* Steel blue background */
        padding: 20px;
        border-radius: 8px;
    }

    .playlist-cover-container {
        position: relative;
        width: 32px;
        height: 32px;
        margin-right: 8px;
    }

    .playlist-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 2px;
    }

    .play-button-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 2px;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .play-button-overlay:hover {
        background: rgba(0, 0, 0, 0.7);
    }

    .playlist-cover-container:hover .play-button-overlay {
        display: flex;
    }

    .play-icon {
        width: 16px;
        height: 16px;
        color: white;
    }
`;
