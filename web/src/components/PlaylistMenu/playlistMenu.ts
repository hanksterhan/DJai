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

    private createPlaylistRow(
        playlist: PlaylistDetails & SpotifyPlaylist
    ): Row {
        const imageStyles = {
            width: "32px",
            height: "32px",
            objectFit: "cover",
            borderRadius: "2px",
            marginRight: "8px",
            padding: "0",
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
                                <img
                                    src="${playlist.images?.[0]?.url || ""}"
                                    alt="${playlist.name}"
                                    loading="lazy"
                                    style=${styleMap(imageStyles)}
                                    @error=${(e: Event) => {
                                        const img =
                                            e.target as HTMLImageElement;
                                        img.style.display = "none";
                                    }}
                                />
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
