import { action, makeObservable, observable } from "mobx";

interface CurrentTrack {
    name: string;
    uri: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
}

export class CurrentlyPlayingStore {
    @observable
    currentTrack: CurrentTrack | null = null;

    @observable
    isPlaying: boolean = false;

    @observable
    deviceId: string | null = null;

    constructor() {
        makeObservable(this);
    }

    @action
    setCurrentTrack(track: CurrentTrack | null) {
        this.currentTrack = track;
    }

    @action
    setIsPlaying(isPlaying: boolean) {
        this.isPlaying = isPlaying;
    }

    @action
    setDeviceId(deviceId: string | null) {
        this.deviceId = deviceId;
    }

    get getCurrentTrack() {
        return this.currentTrack;
    }

    get getIsPlaying() {
        return this.isPlaying;
    }

    get getDeviceId() {
        return this.deviceId;
    }
}

export const currentlyPlayingStore = new CurrentlyPlayingStore();
