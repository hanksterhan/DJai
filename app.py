#!/usr/bin/env python3

import os, sys, json
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
import plotly.graph_objs as go
import spotipy
import webbrowser
import spotipy.util as util
from simplejson import JSONDecodeError
import json
from dotenv import load_dotenv


external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

app.layout = html.Div(children=[
    html.H1("DJai - an AI DJ connected to your Spotify"),
    html.Div([
        html.Label('Artist Name'),
        dcc.Input(id='artist', value='Chance the Rapper', type='text'),

        html.Button(id='submit-button', children="Run"),
        
        html.Div(id='artist_results'),
    ]),
    
    # Hidden div inside the app that stores the SpotifyObj
    html.Div(id='spotify-data', style={'display': 'none'})
])

# callback to search for an artist
# activated when the "Run" button is clicked
@app.callback(
    Output(component_id='spotify-data', component_property='children'),
    [Input('submit-button', 'n_clicks')],
)
def authenticate(n_clicks):
    load_dotenv()

    # Get the username from .env file
    username = os.getenv("SPOTIFY_USERNAME")

    # Get clientID and clientSecret from .env file
    clientID = os.getenv("CLIENT_ID")
    clientSecret = os.getenv("CLIENT_SECRET")

    scope = 'user-read-private user-read-playback-state user-modify-playback-state'

    # Erase cache and prompt for user permission
    try:
        token = util.prompt_for_user_token(username, scope, client_id=clientID, client_secret=clientSecret)
    except:
        os.remove(f".cache-{username}")
        token = util.prompt_for_user_token(username, scope, client_id=clientID, client_secret=clientSecret)

    # Create our spotify Object
    # spotifyObj = spotipy.Spotify(auth=token)

    return(token)

# callback to query artists
# activated when the "Run" button is clicked
@app.callback(
    Output('artist_results', 'children'),
    [Input('submit-button', 'n_clicks'),
     Input('spotify-data', 'children')],
    [State('artist', 'value')]
)
def query_artist(nclicks, token, artist):
    """ Given the spotify authentication token and the artist, query Spotify and get the artist metadata
        TODO: maybe return a hyperlink that causes a button to pop to link to their spotify page?
        TODO: handle if the artist does not pop up
    """
    # read in the object metadata
    spotifyObj = spotipy.Spotify(auth=token)

    # Get search results:
    searchResults = spotifyObj.search(artist, 1, 0, "artist")

    # Artist details
    artist = searchResults['artists']['items'][0]
    print(json.dumps(searchResults, sort_keys=True, indent=4))

    return(artist['name'] + ', ', str(artist['followers']['total']) + " followers, " + artist['genres'][0])

if __name__ == '__main__':
    app.run_server(debug=True)