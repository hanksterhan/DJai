import { action, makeObservable, observable, runInAction } from "mobx";
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
            runInAction(() => {
                this.isAuthenticated = authStatus.isAuthenticated;
                if (!this.isAuthenticated) {
                    this.error = "User is not authenticated";
                }
            });
        } catch (error) {
            runInAction(() => {
                this.isAuthenticated = false;
                this.error =
                    error instanceof Error
                        ? error.message
                        : "Failed to check authentication status";
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
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
            runInAction(() => {
                this.error =
                    error instanceof Error
                        ? error.message
                        : "Failed to connect to Spotify";
            });
            // Don't redirect to Spotify if there's an error
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    @action
    setError(error: string | null) {
        this.error = error;
    }
}

export const userStore = new UserStore();
