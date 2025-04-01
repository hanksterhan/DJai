import { css } from "lit";

export const styles = css`
    slot {
        z-index: -10;
    }

    :host {
        border-radius: 8px;
        animation-duration: 2.2s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: shimmer;
        animation-timing-function: linear;
        background: #2d2d2d; /* Dark gray background */
        color: #ffffff; /* White text */
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    @-webkit-keyframes shimmer {
        0% {
            background-position: -100% 0;
        }
        100% {
            background-position: 100% 0;
        }
    }

    @keyframes shimmer {
        0% {
            background-position: -1200px 0;
        }
        100% {
            background-position: 1200px 0;
        }
    }
`;
