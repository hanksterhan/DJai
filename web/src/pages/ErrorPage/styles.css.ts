import { css } from "lit";

export const styles = css`
    :host {
        display: block;
        height: 100%;
        width: 100%;
    }

    .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 2rem;
        background-color: var(--spectrum-blue-300);
    }

    .error-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        max-width: 500px;
        padding: 2rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .error-icon {
        color: #e34850;
        margin-bottom: 1rem;
    }

    .error-message {
        font-size: 1.1rem;
        margin: 0 0 2rem 0;
        color: #4d4d4d;
        line-height: 1.5;
    }

    .home-button {
        min-width: 150px;
    }
`;
