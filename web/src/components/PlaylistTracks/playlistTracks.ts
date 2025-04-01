import { html } from "lit";
import { styles } from "./styles.css";
import { customElement, property, state, query } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { playlistStore } from "../../stores/PlaylistStore/playlistStore";
import { TableData, Row, setFlex } from "../PlatformTable/tableInterfaces";
import { SpotifyPlaylistTrackItem } from "@common/interfaces";
import { styleMap } from "lit/directives/style-map.js";
import { currentlyPlayingStore } from "../../stores/CurrentlyPlayingStore/currentlyPlayingStore";
import { SpotifyPlayer } from "../SpotifyPlayer/spotifyPlayer";

@customElement("playlist-tracks")
export class PlaylistTracks extends MobxLitElement {
    static readonly TAG_NAME = "playlist-tracks";
    static get styles() {
        return styles;
    }

    @property({ type: String })
    playlistId: string | null = null;

    @query("spotify-player")
    private spotifyPlayer?: SpotifyPlayer;

    @state()
    private tracksTableData: TableData = {
        headers: [
            {
                id: "index",
                label: "#",
                sort: "index",
                flex: setFlex(0.5, 1, "5%"),
            },
            {
                id: "name",
                label: "Title",
                sort: "name",
                flex: setFlex(3, 1, "55%"),
            },
            {
                id: "album",
                label: "Album",
                sort: "album",
                flex: setFlex(2, 1, "30%"),
            },
            {
                id: "duration",
                label: "Duration",
                sort: "duration",
                flex: setFlex(1, 1, "30%"),
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
                rows: selectedPlaylist.tracks.map((track, index) =>
                    this.createTrackRow(track, index)
                ),
            };
        }
    }

    private createTrackRow(
        track: SpotifyPlaylistTrackItem,
        index: number
    ): Row {
        const isCurrentTrack =
            currentlyPlayingStore.getCurrentTrack?.uri === track.track.uri;
        const isPlaying = currentlyPlayingStore.getIsPlaying && isCurrentTrack;

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
            gap: "16px",
            padding: "8px",
            backgroundColor: isCurrentTrack
                ? "rgba(29, 185, 84, 0.1)"
                : "transparent",
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
            opacity: "0.7",
        };

        const indexContainerStyles = {
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
        };

        const trackNumberStyles = {
            display: "block",
            color: isCurrentTrack ? "#1DB954" : "inherit",
        };

        const playButtonStyles = {
            display: "none",
            color: isPlaying ? "#1DB954" : "inherit",
        };

        const handlePlayClick = (e: Event) => {
            e.stopPropagation();
            currentlyPlayingStore.setCurrentTrack({
                name: track.track.name,
                uri: track.track.uri,
                artists: track.track.artists,
                album: {
                    name: track.track.album.name,
                    images: track.track.album.images,
                },
            });
            this.spotifyPlayer?.playTrack(track.track.uri);
        };

        return {
            id: track.track.id,
            cells: [
                {
                    header: "index",
                    value: (index + 1).toString(),
                    render: () => html`
                        <platform-table-cell>
                            <div
                                class="index-container"
                                style=${styleMap(indexContainerStyles)}
                                @click=${handlePlayClick}
                                @mouseenter=${(e: Event) => {
                                    const target =
                                        e.currentTarget as HTMLElement;
                                    const trackNumber = target.querySelector(
                                        ".track-number"
                                    ) as HTMLElement;
                                    const playButton = target.querySelector(
                                        ".play-button"
                                    ) as HTMLElement;
                                    if (trackNumber && playButton) {
                                        trackNumber.style.display = "none";
                                        playButton.style.display = "block";
                                    }
                                }}
                                @mouseleave=${(e: Event) => {
                                    const target =
                                        e.currentTarget as HTMLElement;
                                    const trackNumber = target.querySelector(
                                        ".track-number"
                                    ) as HTMLElement;
                                    const playButton = target.querySelector(
                                        ".play-button"
                                    ) as HTMLElement;
                                    if (trackNumber && playButton) {
                                        trackNumber.style.display = "block";
                                        playButton.style.display = "none";
                                    }
                                }}
                            >
                                <span
                                    class="track-number"
                                    style=${styleMap(trackNumberStyles)}
                                    >${index + 1}</span
                                >
                                <span
                                    class="play-button"
                                    style=${styleMap(playButtonStyles)}
                                    >▶</span
                                >
                            </div>
                        </platform-table-cell>
                    `,
                },
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
                                            .map((a: any) => a.name)
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
