import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { playlistStore } from "../../stores/PlaylistStore/playlistStore";
import { TableData, Row, setFlex } from "../PlatformTable/tableInterfaces";
import { SpotifyPlaylistTrackItem } from "@common/interfaces";
import { styleMap } from "lit/directives/style-map.js";

@customElement("playlist-tracks")
export class PlaylistTracks extends MobxLitElement {
    static readonly TAG_NAME = "playlist-tracks";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    playlistId: string | null = null;

    @state()
    private tracksTableData: TableData = {
        headers: [
            {
                id: "name",
                label: "Title",
                sort: "name",
                flex: setFlex(3, 1, "0%"),
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

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        if (changedProperties.has("playlistId")) {
            await this.loadPlaylistTracks();
        }
    }

    private async loadPlaylistTracks() {
        if (!this.playlistId) return;

        const playlist = playlistStore.getPlaylist(this.playlistId);
        if (!playlist) return;

        // Only fetch tracks if we haven't already
        if (playlist.tracks.length === 0) {
            await playlistStore.fetchPlaylistTracks(
                this.playlistId,
                (progress) => {
                    console.log(`Loading tracks: ${progress}%`);
                }
            );
        }

        // Update tracks table
        const selectedPlaylist = playlistStore.getPlaylist(this.playlistId);
        if (selectedPlaylist) {
            this.tracksTableData = {
                ...this.tracksTableData,
                rows: selectedPlaylist.tracks.map((track) =>
                    this.createTrackRow(track)
                ),
            };
        }
    }

    private createTrackRow(track: SpotifyPlaylistTrackItem): Row {
        const duration = Math.round(track.track.duration_ms / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        const imageStyles = {
            width: "48px",
            height: "48px",
            objectFit: "cover",
            borderRadius: "2px",
            padding: "0",
        };

        const containerStyles = {
            display: "flex",
            alignItems: "center",
            gap: "12px",
        };

        const textContainerStyles = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "4px",
        };

        const titleStyles = {
            fontSize: "14px",
            fontWeight: "bold",
        };

        const artistStyles = {
            fontSize: "12px",
            opacity: "0.8",
        };

        return {
            id: track.track.id,
            cells: [
                {
                    header: "name",
                    value: track.track.name,
                    render: () => html`
                        <platform-table-cell>
                            <div style=${styleMap(containerStyles)}>
                                <img
                                    src="${track.track.album.images[0]?.url ||
                                    ""}"
                                    alt="${track.track.album.name}"
                                    loading="lazy"
                                    style=${styleMap(imageStyles)}
                                    @error=${(e: Event) => {
                                        const img =
                                            e.target as HTMLImageElement;
                                        img.style.display = "none";
                                    }}
                                />
                                <div style=${styleMap(textContainerStyles)}>
                                    <div style=${styleMap(titleStyles)}>
                                        ${track.track.name}
                                    </div>
                                    <div style=${styleMap(artistStyles)}>
                                        ${track.track.artists
                                            .map((a) => a.name)
                                            .join(", ")}
                                    </div>
                                </div>
                            </div>
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

    render() {
        const playlist = this.playlistId
            ? playlistStore.getPlaylist(this.playlistId)
            : null;

        return html`
            <div class="playlist-tracks">
                ${playlist
                    ? html`
                          <h2>${playlist.name}</h2>
                          <p>${playlist.description || ""}</p>
                          <platform-table
                              .data=${this.tracksTableData as TableData}
                              .isLoading=${playlist.isLoadingTracks}
                          ></platform-table>
                      `
                    : html` <p>Select a playlist to view its tracks</p> `}
            </div>
        `;
    }
}
