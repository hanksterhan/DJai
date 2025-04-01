import { css } from "lit";

export const styles = css`
    .spotify-player {
        background: #282828;
        border-radius: 8px;
        padding: 16px;
        color: white;
        max-width: 400px;
        margin: 0 auto;
    }

    .player-info {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
    }

    .album-art {
        width: 64px;
        height: 64px;
        border-radius: 4px;
        object-fit: cover;
    }

    .track-info {
        flex: 1;
    }

    .track-info h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }

    .track-info p {
        margin: 4px 0 0;
        font-size: 14px;
        color: #b3b3b3;
    }

    .no-track {
        text-align: center;
        color: #b3b3b3;
        width: 100%;
    }

    .player-controls {
        display: flex;
        justify-content: center;
        gap: 8px;
    }

    button {
        background: #1db954;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 24px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background: #1ed760;
    }
`;
