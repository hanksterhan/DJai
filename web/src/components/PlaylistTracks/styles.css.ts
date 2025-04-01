import { css } from "lit";

export const styles = css`
    :host {
        display: block;
        flex: 1;
    }

    .playlist-tracks {
        background-color: #4682b4; /* Steel blue background */
        padding: 20px;
        border-radius: 8px;
    }

    .track-row {
        transition: background-color 0.2s ease;
    }

    .track-row:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .index-container {
        transition: color 0.2s ease;
    }

    .track-number,
    .play-button {
        transition: all 0.2s ease;
    }

    .track-info {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .track-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .track-name {
        font-weight: bold;
        font-size: 14px;
    }

    .artist-name {
        font-size: 12px;
        opacity: 0.7;
    }
`;
