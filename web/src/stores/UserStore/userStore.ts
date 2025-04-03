import { action, makeObservable, observable } from "mobx";
import { spotifyAuthService } from "../../services/spotifyAuthService";

export class UserStore {
    @observable
    isAuthenticated: boolean = false;

    @observable
    isLoading: boolean = true;

    @observable
    error: string | null = null;

    constructor() {
        makeObservable(this);
        this.checkAuthStatus();
    }

    @action
    async checkAuthStatus() {
        try {
            this.isLoading = true;
            this.error = null;
            const authStatus = await spotifyAuthService.getAuthStatus();
            this.isAuthenticated = authStatus.isAuthenticated;

            // Set an error if the user is not authenticated
            if (!this.isAuthenticated) {
                this.error = "User is not authenticated";
            }
        } catch (error) {
            console.error("Failed to check auth status:", error);
            this.isAuthenticated = false;
            this.error =
                error instanceof Error
                    ? error.message
                    : "Failed to check authentication status";
        } finally {
            this.isLoading = false;
        }
    }

    @action
    async login() {
        try {
            this.isLoading = true;
            this.error = null;
            await spotifyAuthService.login();
        } catch (error) {
            console.error("Login failed:", error);
            this.error =
                error instanceof Error
                    ? error.message
                    : "Failed to connect to Spotify";
            // Don't redirect to Spotify if there's an error
        } finally {
            this.isLoading = false;
        }
    }
}

export const userStore = new UserStore();
