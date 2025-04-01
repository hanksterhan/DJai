import { css } from "lit";

export const styles = css`
    .home-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        min-height: 100vh;
        text-align: center;
        gap: 20px;
        border-radius: 8px;
        padding: 40px 25px;
        margin: 20px;
        box-sizing: border-box;
    }

    h1 {
        font-size: 2.5em;
        margin: 0;
    }

    p {
        font-size: 1.2em;
        margin: 0;
    }

    .error {
        color: #ff4444;
    }
`;
