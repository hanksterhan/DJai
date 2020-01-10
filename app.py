#!/usr/bin/env python3

import dash
import dash_table
import dash_core_components as dcc 
import dash_html_components as html
from dash.dependencies import Input, Output, State
import spotipy 
import spotipy.util as util 
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os, ast
import json

external_stylesheets = ['https://codepen.io/chirddyp/pen/dZVMbK.css']

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

app.config.suppress_callback_exceptions = True

####################################################
## Helper functions
####################################################
def get_user_id():
    """ returns the user's Spotify user id
    """
    load_dotenv()
    return os.getenv("SPOTIFY_USERNAME")


def get_token():
    """ returns a valid Spotify authentication token, refreshes the token if it is expired
    """ 
    load_dotenv()

    # Get clientID and clientSecret from .env file
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    user_id = os.getenv("SPOTIFY_USERNAME")

    scope = 'user-read-private user-read-playback-state user-modify-playback-state'

    auth = SpotifyOAuth(client_id, 
                client_secret, 
                'http://localhost:8050/callback', 
                cache_path=f".cache-{user_id}",
                scope="user-library-read")

    if auth._is_token_expired(auth.get_cached_token()):
        return auth.refresh_access_token(auth.get_cached_token()['refresh_token'])['access_token']
    return auth.get_cached_token()['access_token']

# retrieves user's playlists
def get_playlists():
    token = get_token()
    user_id = get_user_id()

    sp = spotipy.Spotify(auth=token)
    playlists = sp.user_playlists(user_id)

    data = [{'Playlist Name': pl['name'], 'Playlist ID': pl['id'], 'Number of Tracks':pl['tracks']['total']}for pl in playlists['items']]
    return data

####################################################
## Multi Page Layout
####################################################
index_page = html.Div([
    html.Button(children=[dcc.Link('Log in', href='/login')]),
    html.Button(children=[dcc.Link('Home', href='/')]),
])

login_layout = html.Div([
    html.H1('Log in'),
    html.Div(id='login_content', children=[
        dcc.Input(
            id='username',
            placeholder='Spotify Username',
            type='text',
            value=''
        ),
        html.Button(id='login_button',
                    children='Log in',
        ),
    ]),
    html.Br(),
    html.Button(children=[
        html.A(
            'Click this link to log into Spotify on Spotify',
            id='authorize_link',
            href='',
        )
    ],
        id='authorize_button',
        style={'display':'none'}
    ),
    html.Br(),
    html.Button(children=[dcc.Link('Home', href='/')]),
])

home_layout = html.Div([
    html.H1('Welcome to DJai', style={'textAlign':'center'}),
    html.Br(),
    dcc.Tabs([
        dcc.Tab(label='Playlists', children=[
            html.Div(id='playlist_container', children=[
                dash_table.DataTable(
                    id='playlist_table',
                    columns=[{"name":i, "id":i} for i in ['Playlist Name', 'Playlist ID', 'Number of Tracks']],
                    data=get_playlists(),
                    row_selectable='single',
                    sort_action='native',
                    hidden_columns=['Playlist ID'],
                    fixed_rows={
                        'headers': True,
                        'data': 0
                    },
                    style_data={
                        'whiteSpace':'normal',
                        'height':'auto',
                        'width':'50%'
                    },
                    style_as_list_view=True,
                    style_cell_conditional=[
                        {
                            'textAlign': 'center',
                        }
                    ],
                    style_data_conditional=[
                        {
                            'if': {'row_index': 'odd'}, 
                            'backgroundColor':'rgb(230, 230, 230)'
                        },
                    ],
                    style_header={
                        'backgroundColor': 'rgb(230, 230, 230)',
                        'fontWeight': 'bold'
                    },
                    virtualization=True,
                ),
                html.Br(),
            ]),
        ]),
        dcc.Tab(id='songs', label='Songs', children=[
            html.Div(id='song_container',  children=[
                dash_table.DataTable(
                    id='song_table',
                    columns=[
                        {'name':i, 'id':i} for i in ['Track Name', 'Track URI', 'Artists', 'Album', 'Link to Spotify']
                    ],
                    sort_action='native',
                    hidden_columns=['Track URI'],
                    style_data={
                        'whiteSpace':'normal',
                        'height':'auto',
                        'width': '50px'
                    },
                    style_cell={
                        'whiteSpace': 'normal'
                    },
                    fixed_rows={
                        'headers': True,
                        'data': 0
                    },
                    style_cell_conditional=[
                        {
                            'textAlign': 'center',
                        },
                    ],
                    style_data_conditional=[
                        {
                            'if': {'row_index': 'odd'}, 
                            'backgroundColor':'rgb(230, 230, 230)'

                        },
                    ],
                    style_header={
                        'backgroundColor': 'rgb(230, 230, 230)',
                        'fontWeight': 'bold'
                    },
                    virtualization=True,
                    page_action='none'
                ),
                html.Br(),
            ]),
        ]),
    ]),
    
    html.Button(children=[dcc.Link('Log in', href='/login')]),
])

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page_content'),

    # hidden divs
    html.Div(id='dummy', style={'display':'none'}),
])

####################################################
## Callbacks
####################################################

# Update which page is shown 
@app.callback(
    Output('page_content', 'children'),
    [Input('url', 'pathname'),
     Input('url', 'href')]
)
def display_page(pathname, fullpath):
    if pathname == '/login':
        return login_layout
    elif pathname == '/':
        return home_layout
    elif pathname == '/callback':
        if os.getenv('SPOTIFY_USERNAME'):
            load_dotenv()

            # Get clientID and clientSecret from .env file
            client_id = os.getenv("CLIENT_ID")
            client_secret = os.getenv("CLIENT_SECRET")
            user_id = os.getenv("SPOTIFY_USERNAME")

            scope = 'user-read-private user-read-playback-state user-modify-playback-state'

            auth = SpotifyOAuth(client_id, 
                        client_secret, 
                        'http://localhost:8050/callback', 
                        cache_path=f".cache-{user_id}",
                        scope="user-library-read")

            code = auth.parse_response_code(fullpath)

            # authenticate and get the access token
            try:
                # this is when the cache is written
                token = auth.get_access_token(code)
                return home_layout
            except spotipy.oauth2.SpotifyOauthError as e:
                return home_layout
            
        return index_page
    else:
        return index_page
    # You could also return a 404 "URL not found" page here


# Callback to log in and store client token
# Activated when the "Log in" button is clicked
@app.callback(
    [Output('authorize_button', 'style'),
     Output('authorize_link', 'href')],
    [Input('login_button', 'n_clicks')],
    [State('username', 'value')]
)
def authenticate(n_clicks, username): 
    if n_clicks:
        print('authenticating, try # ', n_clicks)
        
        # add spotify username to .env file if it's not already there
        if not os.getenv('SPOTIFY_USERNAME'):
            f = open('.env', 'a')
            f.write('\nSPOTIFY_USERNAME={}'.format(username))
            f.close()

        load_dotenv()

        # Get clientID and clientSecret from .env file
        client_id = os.getenv("CLIENT_ID")
        client_secret = os.getenv("CLIENT_SECRET")
        user_id = os.getenv("SPOTIFY_USERNAME")

        scope = 'user-read-private user-read-playback-state user-modify-playback-state'

        auth = SpotifyOAuth(client_id, 
                    client_secret, 
                    'http://localhost:8050/callback', 
                    cache_path=f".cache-{user_id}",
                    scope="user-library-read")
        return None, auth.get_authorize_url()



# Callback to dial into a specific user playlist
@app.callback(
    [Output('songs', 'label'),
     Output('song_container', 'style'),
     Output('song_table', 'data')],
    [Input('playlist_table', 'selected_rows'),
     Input('playlist_table', 'data')]
)
def select_playlist(active_row, data):
    # if a row is selected
    if active_row:
        # get metadata
        token = get_token()
        user_id = get_user_id()
        sp = spotipy.Spotify(auth=token) # get authentication token
        plid = data[active_row[0]]['Playlist ID'] # get playlist id

        # query metadata from up to the first 100 tracks in the playlist
        tracks = sp.user_playlist_tracks(user_id, plid, fields=['total,items(track(name, uri, album(artists, name),external_urls))'])
        playlist_data = [
            {
                'Track Name': track['track']['name'], 
                'Track URI': track['track']['uri'], 
                'Artists': [artist['name'] for artist in track['track']['album']['artists']], 
                'Album': track['track']['album']['name'], 
                'Link to Spotify': track['track']['external_urls'].get('spotify', 'No link')
            } for track in tracks['items']
        ]

        # if the playlist is longer than 100 songs, get the rest of the tracks: 
        offset=100
        while len(playlist_data) < tracks['total']:
            tracks = sp.user_playlist_tracks(user_id, plid, offset=offset, fields=['total,items(track(name, uri, album(artists, name),external_urls))'])
            playlist_data += [
                {
                    'Track Name': track['track']['name'], 
                    'Track URI': track['track']['uri'], 
                    'Artists': [artist['name'] for artist in track['track']['album']['artists']], 
                    'Album': track['track']['album']['name'], 
                    'Link to Spotify': track['track']['external_urls'].get('spotify', 'No link')
                } for track in tracks['items']
            ]   
            offset += 100
        
        # update the label of the second tab, make it visible, and return the tracks to populate the data table
        return "'" + data[active_row[0]]['Playlist Name'] + "'" + ' Songs', None, playlist_data
    
    # otherwise do essentially nothing:
    return 'Songs', None, [{'Track Name': 'Select a Playlist','Track URI': '','Artists': '','Album': '', 'Link to Spotify': '',}]

if __name__ == '__main__':
    app.run_server(debug=True) 