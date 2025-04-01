import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MobxLitElement } from "@adobe/lit-mobx";
import { styles } from "./styles.css";

@customElement("playlist-table")
export class PlaylistTable extends MobxLitElement {
    static readonly TAG_NAME = "playlist-table";
    static styles = styles;

    @state()
    private selectedPlaylistId: string | null = null;

    private handlePlaylistSelect(playlistId: string) {
        this.selectedPlaylistId = playlistId;
    }

    render() {
        return html`
            <div class="playlist-container">
                <playlist-menu
                    .onPlaylistSelect=${(playlistId: string) =>
                        this.handlePlaylistSelect(playlistId)}
                ></playlist-menu>
                <playlist-tracks
                    .playlistId=${this.selectedPlaylistId}
                ></playlist-tracks>
            </div>
        `;
    }
}
