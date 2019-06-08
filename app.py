#!/usr/bin/env python3

import os, sys, json
import dash
import dash_table
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
import pandas as pd
import spotipy
import webbrowser
import spotipy.util as util
from simplejson import JSONDecodeError
import json
from dotenv import load_dotenv


external_stylesheets = ['https://codepen.io/chriddyp/pen/dZVMbK.css']

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)

df = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/solar.csv')
# print(df.to_dict('records'))
# print(json.dumps(df.to_dict('records'), sort_keys=True, indent=4))


app.layout = html.Div(children=[
    html.H1("DJai - an AI DJ connected to your Spotify"),
    html.Div([
        html.Label('Artist Name'),
        dcc.Input(id='artist', value='Chance the Rapper', type='text'),

        html.Label('Song Name'),
        dcc.Input(id='song', value='Blessings', type='text'),
        html.Div([
            html.Button(id='play_button', 
                children="Play on Device",
                style={
                    'margin':'2%',
                }
            ),
            html.Button(id='play_button_2', 
                children="Play Music",
                style={
                    'margin':'2%',
                }
            ),
            dcc.Dropdown(id="devices")#, style={'display': 'none'}),
        ]),
        html.Div([
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

        ], style={
            'margin-left':'10%',
            'margin-right':'10%',
            'margin-top': '2%',
            'margin-bottom':'5%'
        }),

        html.Button(id='submit_button', 
                    children="Query",
                    style={
                        'margin-left':'10%',
                    }
        ),
        
        # html.Div(id='artist_results'),
        html.Div(id='query_results'),
    ]),
    
    # dash_table.DataTable(
    #     id='datatable', 
    #     columns=[{"name": i, "id": i} for i in ['Artist', 'Song', 'Link to Song', 'Link to Album Art']],
    #     # data=df.to_dict('records'),
    #     n_fixed_rows=1,
    #     style_table={
    #         'maxHeight': '300',
    #         'overflowY': 'scroll'
    #     },
    #     style_cell={'padding': '5px'},
    #     style_header={
    #         'backgroundColor': 'light gray',
    #         'fontWeight': 'bold',
    #     },
    #     style_cell_conditional=[
    #         {'if': {'row_index': 'odd'},
    #          'backgroundColor': 'rgb(248,248,248)'
    #         },
    #         {'if': {'column_id':'Artist'},
    #          'width': '25%',
    #          'textAlign': 'left'},
    #         {'if': {'column_id':'Song'},
    #          'width': '25%',
    #          'textAlign': 'left'},
    #         {'if': {'column_id':'Link to Song'},
    #          'width': '25%',
    #          'textAlign': 'left'},
    #         {'if': {'column_id':'Link to album art'},
    #          'width': '25%',
    #          'textAlign': 'left'},
    #     ],
    #     style_as_list_view=True,
    #     virtualization=True,
    #     pagination_mode=False,
    # ),
    html.Div(id='table'),
    
    # Hidden div inside the app that stores the SpotifyObj
    html.Div(id='spotify_data', style={'display': 'none'}),
    html.Div(id='artist_uri', style={'display': 'none'}),
    html.Div(id='song_uris', style={'display':'none'}),
    html.Div(id='devices2', style={'display':'none'}),


], style={
            'margin-left':'10%',
            'margin-right':'10%',
})

####################################################
## Callbacks for displaying query selections
####################################################

#callback to display the query's popularity range
@app.callback(
    Output('popularity_output', 'children'), 
    [Input('popularity', 'value')],
)
def update_output(value):
    return('Popularity: {} - {}'.format(value[0], value[1]))

#callback to display the query's tempo range
@app.callback(
    Output('tempo_output', 'children'), 
    [Input('tempo', 'value')],
)
def update_output(value):
    return('Tempo: {}bpm - {}bpm'.format(value[0], value[1]))

#callback to display the query's energy range
@app.callback(
    Output('energy_output', 'children'), 
    [Input('energy', 'value')],
)
def update_output(value):
    return('Energy: {} - {}'.format(value[0], value[1]))

#callback to display the query's danceability range
@app.callback(
    Output('dance_output', 'children'), 
    [Input('dance', 'value')],
)
def update_output(value):
    return('Danceability: {} - {}'.format(value[0], value[1]))

#callback to display the query's valence range
@app.callback(
    Output('valence_output', 'children'), 
    [Input('valence', 'value')],
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

# # callback to query artists
# # activated when the "Run" button is clicked
# @app.callback(
#     Output('artist_results', 'children'),
#     [Input('submit_button', 'n_clicks'),
#      Input('spotify_data', 'children')],
#     [State('artist', 'value')]
# )
# def query_artist(nclicks, token, artist):
#     """ Given the spotify authentication token and the artist, query Spotify and get the artist metadata
#         TODO: maybe return a hyperlink that causes a button to pop to link to their spotify page?
#         TODO: handle if the artist does not pop up
#     """
#     # read in the object metadata
#     spotifyObj = spotipy.Spotify(auth=token)

#     # Get search results:
#     searchResults = spotifyObj.search(artist, 1, 0, "artist")

#     # Artist details
#     artist = searchResults['artists']['items'][0]
#     # print(json.dumps(searchResults, sort_keys=True, indent=4))

#     return(artist['name'] + ', ', str(artist['followers']['total']) + " followers, " + artist['genres'][0])

# # Recommendation callback
# @app.callback(
#     Output('datatable', 'data'),
#     [Input('submit_button', 'n_clicks')],
#     [State('spotify_data', 'children'),
#      State('artist_uri', 'children'),
#      State('popularity', 'value'),
#      State('tempo', 'value'),
#      State('energy', 'value'),
#      State('dance', 'value'),
#      State('valence', 'value')],
# )
# def query_tracks(n_clicks, token, artist_uris, popularity, tempo, energy, dance, valence):
#     # read in the object metadata
#     spotifyObj = spotipy.Spotify(auth=token)

#     # Get search results:
#     searchResults = spotifyObj.recommendations(seed_artists=[artist_uris],
#                                                min_popularity=popularity[0], 
#                                                max_popularity=popularity[1], 
#                                                min_tempo=tempo[0], 
#                                                max_tempo=tempo[1], 
#                                                min_energy=energy[0], 
#                                                max_energy=energy[1], 
#                                                min_dance=dance[0], 
#                                                max_dance=dance[1], 
#                                                min_valence=valence[0], 
#                                                max_valence=valence[1], 
#                                                country='US',
#                                                limit=2)


#     # print(json.dumps(searchResults['tracks'], sort_keys=True, indent=4))
#     for result in searchResults['tracks']:
#         print("Artists: ", [artist['name'] for artist in result['artists']])
#         print("Song: ", result['name'])
#         print("Link to song: ", result['external_urls']["spotify"])
#         print("Link to album art:", result['album']['images'][2]['url'])
#         print()

#     data = []

#     for result in searchResults['tracks']:
#         data_dict = {
#             "Artist": str([artist['name'] for artist in result['artists']]),
#             "Song": result['name'],
#             "Link to Song": result['external_urls']['spotify'],
#             "Link to Album Art": "html.Img(src=result['album']['images'][2]['url']),"
#         }
#         data.append(data_dict)

#     print(json.dumps(data, sort_keys=True, indent=4))
#     # return(searchResults)
#     return(data)

# Recommendation callback
@app.callback(
    [Output('table', 'children'),
     Output('song_uris', 'children')],
    [Input('submit_button', 'n_clicks')],
    [State('spotify_data', 'children'),
     State('artist_uri', 'children'),
     State('popularity', 'value'),
     State('tempo', 'value'),
     State('energy', 'value'),
     State('dance', 'value'),
     State('valence', 'value')],
)
def populate_table(n_clicks, token, artist_uris, popularity, tempo, energy, dance, valence):
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

    data = []
    song_uris = []
    
    for result in searchResults['tracks']:
        data_dict = {
            "Artist": [artist['name'] + ', ' if index is not len(result['artists'])-1 else artist['name']for index, artist in enumerate(result['artists']) ],
            "Song Name": result['name'],
            "Song": result['external_urls']['spotify'],
            "Link to Album Art": result['album']['images'][2]['url'],
        }
        data.append(data_dict)
        song_uris.append(result['uri'])#[14:])

    df = pd.DataFrame.from_dict(data)
    rows = []
    for i in range(len(df)):
        row = []
        for index, col in enumerate(df.columns):
            value = df.iloc[i][col]
            # update this to change what to display inside cell of table
            if col == 'Song':
                cell = html.Td(html.A(href=value, children=df.iloc[i][index+1]),style={'width':'20%'})
            elif col == "Link to Album Art":
                cell = html.Td(html.Img(src=value),style={'width':'20%'})
            elif col == "Song Name":
                continue
            else:
                cell = html.Td(children=value,style={'width':'20%'})
            row.append(cell)
        rows.append(html.Tr(row))
    return html.Table(
        # Header
        [html.Tr([html.Th(col,style={'width':'20%'}) for col in df.columns if col != "Song Name"])] +

        # Body
        rows
    ), song_uris

# Get list of usable devices:
@app.callback(
    [Output('devices', 'style'),
     Output('devices', 'options')],
    [Input('play_button', 'n_clicks')],
    [State('spotify_data', 'children')],
)
def get_devices(n_clicks, token):
    # read in the object metadata
    spotifyObj = spotipy.Spotify(auth=token)

    # get devices
    devices = spotifyObj.devices()
    
    device_list = [{'label': device['name'], 'value': device['id']} for device in devices['devices']]

    return {'display': 'block'}, list(device_list)

# start playing music on chosen device
@app.callback(
    [Output('devices2', 'children')], # placeholder
    [Input('play_button_2', 'n_clicks')],
    [State('spotify_data', 'children'), 
     State('devices', 'value'),
     State('song_uris', 'children')]
)
def play_music(n_clicks, token, device, uris):
    # read in the object metadata
    spotifyObj = spotipy.Spotify(auth=token)

    print(uris)
    spotifyObj.start_playback(device_id=device, uris=uris)


# TODO:
# user_playlist_create

if __name__ == '__main__':
    app.run_server(debug=True)