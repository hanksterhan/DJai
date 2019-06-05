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

        html.Div(id='popularity_output'),
        dcc.RangeSlider(id='popularity', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Div(id='tempo_output',
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='tempo', min=40, max=200, step=4, value=[40,200],
                    marks={i: '{}'.format(i) for i in range(40,201,10)}),

        html.Div(id='energy_output',
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='energy', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Div(id='dance_output', 
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='dance', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Div(id='valence_output', 
            style={
                'padding': '20px 10px 0px 0px'
            }),
        dcc.RangeSlider(id='valence', min=0, max=100, step=1, value=[0,100],
                    marks={i: '{}'.format(i) for i in range(0,101,10)}),

        html.Button(id='submit_button', children="Query"),
        
        html.Div(id='artist_results'),
        html.Div(id='query_results'),
    ]),
    
    # Hidden div inside the app that stores the SpotifyObj
    html.Div(id='spotify_data', style={'display': 'none'}),
    html.Div(id='artist_uri', style={'display': 'none'}),

])

####################################################
## Callbacks for displaying query selections
####################################################

#callback to display the query's popularity range
@app.callback(
    dash.dependencies.Output('popularity_output', 'children'), 
    [dash.dependencies.Input('popularity', 'value')],
)
def update_output(value):
    return('Popularity: {} - {}'.format(value[0], value[1]))

#callback to display the query's tempo range
@app.callback(
    dash.dependencies.Output('tempo_output', 'children'), 
    [dash.dependencies.Input('tempo', 'value')],
)
def update_output(value):
    return('Tempo: {}bpm - {}bpm'.format(value[0], value[1]))

#callback to display the query's energy range
@app.callback(
    dash.dependencies.Output('energy_output', 'children'), 
    [dash.dependencies.Input('energy', 'value')],
)
def update_output(value):
    return('Energy: {} - {}'.format(value[0], value[1]))

#callback to display the query's danceability range
@app.callback(
    dash.dependencies.Output('dance_output', 'children'), 
    [dash.dependencies.Input('dance', 'value')],
)
def update_output(value):
    return('Danceability: {} - {}'.format(value[0], value[1]))

#callback to display the query's valence range
@app.callback(
    dash.dependencies.Output('valence_output', 'children'), 
    [dash.dependencies.Input('valence', 'value')],
)
def update_output(value):
    return('Valence (positivity of the track): {} - {}'.format(value[0], value[1]))




# callback to store client token
# activated when the "Run" button is clicked
@app.callback(
    Output(component_id='spotify_data', component_property='children'),
    [Input('submit_button', 'n_clicks')],
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

    return(token)

# callback to store artist uri
@app.callback(
    Output(component_id='artist_uri', component_property='children'),
    [Input('submit_button', 'n_clicks'),
     Input('spotify_data', 'children')],
    [State('artist', 'value')]
)
def get_artist_uri(n_clicks, token, artist):
    # read in the object metadata
    spotifyObj = spotipy.Spotify(auth=token)

    #Get search results:
    searchResults = spotifyObj.search(artist, limit=1, offset=0, type='artist')

    # Artist details
    artist = searchResults['artists']['items'][0]

    return(artist['uri'][15:])

# callback to query artists
# activated when the "Run" button is clicked
@app.callback(
    Output('artist_results', 'children'),
    [Input('submit_button', 'n_clicks'),
     Input('spotify_data', 'children')],
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
    # print(json.dumps(searchResults, sort_keys=True, indent=4))

    return(artist['name'] + ', ', str(artist['followers']['total']) + " followers, " + artist['genres'][0])

# Recommendation callback
@app.callback(
    Output('query_results', 'children'),
    [Input('submit_button', 'n_clicks')],
    [State('spotify_data', 'children'),
     State('artist_uri', 'children'),
     State('popularity', 'value'),
     State('tempo', 'value'),
     State('energy', 'value'),
     State('dance', 'value'),
     State('valence', 'value')],
)
def query_tracks(n_clicks, token, artist_uris, popularity, tempo, energy, dance, valence):
    # read in the object metadata
    spotifyObj = spotipy.Spotify(auth=token)

    # Get search results:
    searchResults = spotifyObj.recommendations(seed_artists=[artist_uris],
                                               min_popularity=popularity[0], 
                                               max_popularity=popularity[1], 
                                               min_tempo=tempo[0], 
                                               max_tempo=tempo[1], 
                                               min_energy=energy[0], 
                                               max_energy=energy[1], 
                                               min_dance=dance[0], 
                                               max_dance=dance[1], 
                                               min_valence=valence[0], 
                                               max_valence=valence[1], 
                                               country='US',
                                               limit=2)


    print(json.dumps(searchResults['tracks'], sort_keys=True, indent=4))
    for result in searchResults['tracks']:
        print("Artists: ", [artist['name'] for artist in result['artists']])
        print("Song: ", result['name'])
        print("Link to song: ", result['external_urls']["spotify"])
        print()

    return(searchResults)

if __name__ == '__main__':
    app.run_server(debug=True)