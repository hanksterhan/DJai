import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { playlistStore } from "../../stores/PlaylistStore/playlistStore";
import { TableData, Row, setFlex } from "../PlatformTable/tableInterfaces";
import { SpotifyPlaylistTrackItem, PlaylistDetails } from "@common/interfaces";
import { observe } from "mobx";
import { styles } from "./styles.css";

@customElement("playlist-table")
export class PlaylistTable extends MobxLitElement {
    static readonly TAG_NAME = "playlist-table";

    static styles = styles;

    @state()
    private selectedPlaylistId: string | null = null;

    @state()
    private playlistTableData: TableData = {
        headers: [
            {
                id: "name",
                label: "Name",
                sort: "name",
                flex: setFlex(1, 1, "0%"),
            },
            {
                id: "trackCount",
                label: "Tracks",
                sort: "trackCount",
                flex: setFlex(1, 1, "0%"),
            },
        ],
        rows: [],
    };

    @state()
    private tracksTableData: TableData = {
        headers: [
            {
                id: "name",
                label: "Title",
                sort: "name",
                flex: setFlex(2, 1, "0%"),
            },
            {
                id: "artist",
                label: "Artist",
                sort: "artist",
                flex: setFlex(2, 1, "0%"),
            },
            {
                id: "album",
                label: "Album",
                sort: "album",
                flex: setFlex(2, 1, "0%"),
            },
            {
                id: "duration",
                label: "Duration",
                sort: "duration",
                flex: setFlex(1, 1, "0%"),
            },
        ],
        rows: [],
    };

    constructor() {
        super();
        // Observe playlist store changes
        observe(playlistStore, "playlists", () => {
            this.updatePlaylistTable();
        });
    }

    connectedCallback() {
        super.connectedCallback();
        // Only load playlists if they haven't been loaded yet
        if (playlistStore.playlistArray.length === 0) {
            this.loadPlaylists();
        } else {
            // If playlists are already loaded, update the table
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

    private createPlaylistRow(playlist: PlaylistDetails): Row {
        return {
            id: playlist.id,
            cells: [
                {
                    header: "name",
                    value: playlist.name,
                    render: () => html`
                        <platform-table-cell
                            >${playlist.name}</platform-table-cell
                        >
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

    private createTrackRow(track: SpotifyPlaylistTrackItem): Row {
        const duration = Math.round(track.track.duration_ms / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        return {
            id: track.track.id,
            cells: [
                {
                    header: "name",
                    value: track.track.name,
                    render: () => html`
                        <platform-table-cell>
                            ${track.track.name}
                        </platform-table-cell>
                    `,
                },
                {
                    header: "artist",
                    value: track.track.artists[0]?.name || "",
                    render: () => html`
                        <platform-table-cell>
                            ${track.track.artists.map((a) => a.name).join(", ")}
                        </platform-table-cell>
                    `,
                },
                {
                    header: "album",
                    value: track.track.album.name,
                    render: () => html`
                        <platform-table-cell>
                            ${track.track.album.name}
                        </platform-table-cell>
                    `,
                },
                {
                    header: "duration",
                    value: duration.toString(),
                    render: () => html`
                        <platform-table-cell>
                            ${minutes}:${seconds.toString().padStart(2, "0")}
                        </platform-table-cell>
                    `,
                },
            ],
        };
    }

    private async handlePlaylistClick(row: Row) {
        const playlistId = row.id;
        this.selectedPlaylistId = playlistId;

        const playlist = playlistStore.getPlaylist(playlistId);
        if (!playlist) return;

        // Only fetch tracks if we haven't already
        if (playlist.tracks.length === 0) {
            await playlistStore.fetchPlaylistTracks(playlistId, (progress) => {
                console.log(`Loading tracks: ${progress}%`);
            });
        }

        // Update tracks table
        const selectedPlaylist = playlistStore.getPlaylist(playlistId);
        if (selectedPlaylist) {
            this.tracksTableData = {
                ...this.tracksTableData,
                rows: selectedPlaylist.tracks.map((track) =>
                    this.createTrackRow(track)
                ),
            };
        }
    }

    render() {
        const selectedPlaylist = this.selectedPlaylistId
            ? playlistStore.getPlaylist(this.selectedPlaylistId)
            : null;

        return html`
            <div class="playlist-menu">
                <platform-table
                    .data=${this.playlistTableData as TableData}
                    .isLoading=${playlistStore.isLoading}
                    .handleOnClick=${(row: Row) =>
                        this.handlePlaylistClick(row)}
                ></platform-table>
            </div>
            <div class="playlist-details">
                ${selectedPlaylist
                    ? html`
                          <div class="playlist-table">
                              <h2>${selectedPlaylist.name}</h2>
                              <p>${selectedPlaylist.description || ""}</p>
                              <platform-table
                                  .data=${this.tracksTableData as TableData}
                                  .isLoading=${selectedPlaylist.isLoadingTracks}
                                  class="playlist-table"
                              ></platform-table>
                          </div>
                      `
                    : html` <p>Select a playlist to view its tracks</p> `}
            </div>
        `;
    }
}
