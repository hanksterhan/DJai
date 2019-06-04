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

        html.Label('Song Name'),
        dcc.Input(id='song', value='Blessings', type='text'),

        html.Div(id='popularity-output'),
        dcc.RangeSlider(id='popularity', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Div(id='tempo-output',
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='tempo', min=40, max=200, step=4, value=[40,200],
                    marks={i: '{}'.format(i) for i in range(40,201,10)}),

        html.Div(id='energy-output',
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='energy', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Div(id='dance-output', 
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='dance', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Div(id='valence-output', 
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='valence', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Button(id='submit-button', children="Query"),
        
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

#callback to display the query's popularity range
@app.callback(
    dash.dependencies.Output('popularity-output', 'children'), 
    [dash.dependencies.Input('popularity', 'value')],
)
def update_output(value):
    return('Popularity: {} - {}'.format(value[0], value[1]))

#callback to display the query's tempo range
@app.callback(
    dash.dependencies.Output('tempo-output', 'children'), 
    [dash.dependencies.Input('tempo', 'value')],
)
def update_output(value):
    return('Tempo: {}bpm - {}bpm'.format(value[0], value[1]))

#callback to display the query's energy range
@app.callback(
    dash.dependencies.Output('energy-output', 'children'), 
    [dash.dependencies.Input('energy', 'value')],
)
def update_output(value):
    return('Energy: {} - {}'.format(value[0], value[1]))

#callback to display the query's danceability range
@app.callback(
    dash.dependencies.Output('dance-output', 'children'), 
    [dash.dependencies.Input('dance', 'value')],
)
def update_output(value):
    return('Danceability: {} - {}'.format(value[0], value[1]))

#callback to display the query's valence range
@app.callback(
    dash.dependencies.Output('valence-output', 'children'), 
    [dash.dependencies.Input('valence', 'value')],
)
def update_output(value):
    return('Valence (positivity of the track): {} - {}'.format(value[0], value[1]))

if __name__ == '__main__':
    app.run_server(debug=True)