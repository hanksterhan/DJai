import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { playlistStore } from "../../stores/PlaylistStore/playlistStore";
import { TableData, Row, setFlex } from "../PlatformTable/tableInterfaces";
import { PlaylistDetails, SpotifyPlaylist } from "@common/interfaces";
import { observe } from "mobx";
import { styleMap } from "lit/directives/style-map.js";

@customElement("playlist-menu")
export class PlaylistMenu extends MobxLitElement {
    static readonly TAG_NAME = "playlist-menu";
    static get styles() {
        return styles;
    }

    @property({ type: Function })
    onPlaylistSelect: (playlistId: string) => void = () => {};

    @state()
    private selectedPlaylistId: string | null = null;

    @state()
    private playlistTableData: TableData = {
        headers: [
            {
                id: "name",
                label: "Name",
                sort: "name",
                flex: setFlex(1, 1, "65%"),
            },
            {
                id: "trackCount",
                label: "Tracks",
                sort: "trackCount",
                flex: setFlex(1, 1, "35%"),
            },
        ],
        rows: [],
    };

    constructor() {
        super();
        observe(playlistStore, "playlists", () => {
            this.updatePlaylistTable();
        });
    }

    connectedCallback() {
        super.connectedCallback();
        if (playlistStore.playlistArray.length === 0) {
            this.loadPlaylists();
        } else {
            this.updatePlaylistTable();
        }
    }

    private async loadPlaylists() {
        try {
            await playlistStore.fetchPlaylists();
            this.updatePlaylistTable();
        } catch (error) {
            console.error("Failed to load playlists:", error);
        }
    }

    private updatePlaylistTable() {
        if (!playlistStore.playlistArray.length) {
            return;
        }

        this.playlistTableData = {
            ...this.playlistTableData,
            rows: playlistStore.playlistArray.map((playlist) =>
                this.createPlaylistRow(playlist)
            ),
        };
    }

    private async handlePlayPlaylist(
        playlist: PlaylistDetails & SpotifyPlaylist,
        e: Event
    ) {
        e.stopPropagation();
        try {
            await playlistStore.playPlaylist(playlist.id);
        } catch (error) {
            console.error("Failed to play playlist:", error);
        }
    }

    private createPlaylistRow(
        playlist: PlaylistDetails & SpotifyPlaylist
    ): Row {
        const coverContainerStyles = {
            position: "relative",
            width: "32px",
            height: "32px",
            marginRight: "8px",
        };

        const coverStyles = {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "2px",
        };

        const playButtonStyles = {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "2px",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
        };

        const playIconStyles = {
            width: "16px",
            height: "16px",
            color: "white",
        };

        return {
            id: playlist.id,
            cells: [
                {
                    header: "name",
                    value: playlist.name,
                    render: () => html`
                        <platform-table-cell>
                            <div style="display: flex; align-items: center;">
                                <div
                                    class="playlist-cover-container"
                                    style=${styleMap(coverContainerStyles)}
                                    @mouseenter=${(e: Event) => {
                                        const container =
                                            e.currentTarget as HTMLElement;
                                        const playButton =
                                            container.querySelector(
                                                ".play-button-overlay"
                                            ) as HTMLElement;
                                        if (playButton) {
                                            playButton.style.display = "flex";
                                        }
                                    }}
                                    @mouseleave=${(e: Event) => {
                                        const container =
                                            e.currentTarget as HTMLElement;
                                        const playButton =
                                            container.querySelector(
                                                ".play-button-overlay"
                                            ) as HTMLElement;
                                        if (playButton) {
                                            playButton.style.display = "none";
                                        }
                                    }}
                                >
                                    <img
                                        src="${playlist.images?.[0]?.url || ""}"
                                        alt="${playlist.name}"
                                        loading="lazy"
                                        style=${styleMap(coverStyles)}
                                        @error=${(e: Event) => {
                                            const img =
                                                e.target as HTMLImageElement;
                                            img.style.display = "none";
                                        }}
                                    />
                                    <div
                                        class="play-button-overlay"
                                        style=${styleMap(playButtonStyles)}
                                        @click=${(e: Event) =>
                                            this.handlePlayPlaylist(
                                                playlist,
                                                e
                                            )}
                                    >
                                        <svg
                                            style=${styleMap(playIconStyles)}
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <span>${playlist.name}</span>
                            </div>
                        </platform-table-cell>
                    `,
                },
                {
                    header: "trackCount",
                    value: playlist.tracksTotal.toString(),
                    render: () => html`
                        <platform-table-cell
                            >${playlist.tracksTotal}</platform-table-cell
                        >
                    `,
                },
            ],
            cssClass: this.selectedPlaylistId === playlist.id ? "selected" : "",
        };
    }

    private handlePlaylistClick(row: Row) {
        const playlistId = row.id;
        this.selectedPlaylistId = playlistId;
        this.onPlaylistSelect(playlistId);
    }

    render() {
        return html`
            <div class="playlist-menu">
                <h2>Playlists</h2>
                <platform-table
                    .data=${this.playlistTableData as TableData}
                    .isLoading=${playlistStore.isLoading}
                    .handleOnClick=${(row: Row) =>
                        this.handlePlaylistClick(row)}
                ></platform-table>
            </div>
        `;
    }
}
