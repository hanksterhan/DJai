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
    html.H1('Welcome to DJai'),
    html.Div(id='home_content', children=[
        html.Button(id='query_button',
                    children='Playlist Builder'
        ),
    ]),
    html.Br(),
    dcc.Tabs([
        dcc.Tab(label='Playlists', children=[
            html.Div(id='playlist_container', style={'display':'none'}, children=[
                dash_table.DataTable(
                    id='playlist_table',
                    columns=[{"name":i, "id":i} for i in ['Playlist Name', 'Playlist ID', 'Number of Tracks']],
                    row_selectable='single',
                    sort_action='native',
                    hidden_columns=['Playlist ID'],
                    style_data={
                        'whiteSpace':'normal',
                        'height':'auto'
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
                        
                        }
                    ],
                    style_header={
                        'backgroundColor': 'rgb(230, 230, 230)',
                        'fontWeight': 'bold'
                    }
                ),
                html.Br(),
                html.Button(id='click_playlist', children='Select Playlist')
            ]),
        ]),
        dcc.Tab(id='songs', label='Songs', children=[
            html.Div(id='song_container',  children=[
                dash_table.DataTable(
                    id='song_table',
                    columns=[{"name":i, "id":i} for i in ['Track Name', 'Track URI', 'Artists', 'Album', 'Link to Spotify']],
                    row_selectable='single',
                    sort_action='native',
                    hidden_columns=['Track URI'],
                    style_data={
                        'whiteSpace':'normal',
                        'height':'auto'
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
                        
                        }
                    ],
                    style_header={
                        'backgroundColor': 'rgb(230, 230, 230)',
                        'fontWeight': 'bold'
                    }
                ),
                html.Br(),
                # html.Button(id='click_playlist', children='Select Playlist')
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

# Callback to display user playlists
@app.callback(
    [Output('playlist_container', 'style'),
     Output('playlist_table', 'data')],
    [Input('query_button', 'n_clicks')],
)
def query(n_clicks):
    token = get_token()
    user_id = get_user_id()

    if n_clicks:
        sp = spotipy.Spotify(auth=token)
        playlists = sp.user_playlists(user_id)

        data = [{'Playlist Name': pl['name'], 'Playlist ID': pl['id'], 'Number of Tracks':pl['tracks']['total']}for pl in playlists['items']]
    return None, data

# Callback to dial into a specific user playlist
@app.callback(
    [Output('songs', 'label'),
     Output('song_container', 'style'),
     Output('song_table', 'data')],
    [Input('click_playlist', 'n_clicks')],
    [State('playlist_table', 'selected_rows'),
     State('playlist_table', 'data')],
)
def select_playlist(n_clicks, active_row, data):
    token = get_token()
    user_id = get_user_id()

    sp = spotipy.Spotify(auth=token)
    plid = data[active_row[0]]['Playlist ID']

    tracks = sp.user_playlist(user_id, plid)

    playlist_data = [
        {
            'Track Name': track['track']['name'], 
            'Track URI': track['track']['uri'], 
            'Artists': [artist['name'] for artist in track['track']['album']['artists']], 
            'Album': track['track']['album']['name'], 
            'Link to Spotify': track['track']['external_urls'].get('spotify', 'No link')
        } for track in tracks['tracks']['items']
    ]

    return "'" + data[active_row[0]]['Playlist Name'] + "'" + ' Songs', None, playlist_data

if __name__ == '__main__':
    app.run_server(debug=True) 