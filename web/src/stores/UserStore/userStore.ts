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

            // Only set an error if the user is not authenticated and not loading
            if (!this.isAuthenticated && !this.isLoading) {
                this.error = "User is not authenticated";
            }
        } catch (error) {
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
    setAuthenticated(value: boolean) {
        this.isAuthenticated = value;
    }

    @action
    async login() {
        try {
            this.isLoading = true;
            this.error = null;
            await spotifyAuthService.login();
            // No need to set isAuthenticated here as the page will redirect to Spotify
        } catch (error) {
            this.error =
                error instanceof Error
                    ? error.message
                    : "Failed to connect to Spotify";
            // Don't redirect to Spotify if there's an error
        } finally {
            this.isLoading = false;
        }
    }

    @action
    setError(error: string | null) {
        this.error = error;
    }
}

export const userStore = new UserStore();
