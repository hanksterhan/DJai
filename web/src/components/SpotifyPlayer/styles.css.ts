import { css } from "lit";

export const styles = css`
    .player-container {
        background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
        border-radius: 12px;
        padding: 12px;
        color: white;
        max-width: 50%;
        margin: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .track-info {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .play-button {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #4682b4;
        border: none;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin-right: 16px;
    }

    .play-button:hover {
        background: #74a0c9;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
    }

    .play-button:active {
        transform: scale(0.95);
    }

    .play-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .album-art {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .track-details {
        flex: 1;
    }

    .track-name {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        color: #ffffff;
    }

    .artist-name {
        font-size: 14px;
        color: #b3b3b3;
        margin: 4px 0 0;
    }

    .controls {
        display: flex;
        justify-content: center;
        margin-top: 16px;
    }

    button {
        background: #1db954;
        color: white;
        border: none;
        border-radius: 24px;
        padding: 12px 32px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    button:hover {
        background: #1ed760;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
    }

    button:active {
        transform: translateY(0);
    }

    .no-track {
        text-align: center;
        color: #b3b3b3;
        padding: 32px 0;
        font-size: 16px;
    }

    .initializing {
        text-align: center;
        color: #b3b3b3;
        padding: 32px 0;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    .initializing::after {
        content: "";
        width: 20px;
        height: 20px;
        border: 2px solid #b3b3b3;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .error-message {
        text-align: center;
        color: #ff4444;
        padding: 32px 0;
        font-size: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .error-message button {
        background: #ff4444;
    }

    .error-message button:hover {
        background: #ff6666;
    }
`;
