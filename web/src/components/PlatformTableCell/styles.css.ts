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
        background: var(--spectrum-gray-200);
        background: linear-gradient(
            to right,
            rgb(230, 230, 230) 8%,
            rgb(213, 213, 213) 18%,
            rgb(230, 230, 230) 33%
        );
        background-size: 1200px 100%;
        display: inline-block;
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
