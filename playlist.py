import spotipy
import os, sys, json
import webbrowser
import spotipy.util as util
from simplejson import JSONDecodeError
import json
from dotenv import load_dotenv

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
spotifyObj = spotipy.Spotify(auth=token)

""" To get devices, need to update the code in the spotipy pip folder with the 4 python files that are on the Spotipy Github page here: https://github.com/plamere/spotipy  
"""
# get current device
devices = spotifyObj.devices()
# print(json.dumps(devices,sort_keys=True, indent=4))
deviceID = devices['devices'][1]['id']

# current track information
track = spotifyObj.current_user_playing_track()
# print(json.dumps(track, sort_keys=True, indent=4))
print()
artist = track['item']['artists'][0]['name']
track = track['item']['name']

if artist != "":
    print("Currently playing " + artist + " - " + track)
else:
    print("Currently not playing a song")

user = spotifyObj.current_user()
# print(json.dumps(user, sort_keys=True, indent=4))

displayName = user['display_name']
followers = user['followers']['total']

print()
print(">>> Welcome to Spotipy " + displayName)
print(">>> You have " + str(followers) + " followers.")
print()

# logic for searching for artist and track
while True:
    print("0 - Search for an artist")
    print("1 - exit")
    print()
    choice = int(input("Your choice: "))

    if choice is 0:
        print(choice)
        searchQuery = input("Ok what's their name?: ")

        # Get search results:
        searchResults = spotifyObj.search(searchQuery, 1, 0, "artist")
        print(json.dumps(searchResults, sort_keys=True, indent=4))

        # Artist details
        artist = searchResults['artists']['items'][0]
        print(artist['name'])
        print(str(artist['followers']['total']) + " followers")
        print(artist['genres'][0])
        print()
        webbrowser.open(artist['images'][0]['url'])
        artistID = artist['id']

        # Album and track details
        trackURIs = []
        trackArt = []
        z = 0

        # Extract album data
        albumResults = spotifyObj.artist_albums(artistID)
        albumResults = albumResults['items']

        for item in albumResults:
            print("ALBUM " + item['name'])
            albumID = item['id']
            albumArt = item['images'][0]['url']

            # Extract track data
            trackResults = spotifyObj.album_tracks(albumID)
            trackResults = trackResults['items']

            for item in trackResults:
                print(str(z) + ": " + item['name'])
                trackURIs.append(item['uri'])
                trackArt.append(albumArt)
                z += 1
            
            print()

        # See album art 
        while True: 
            songSelection = input("Enter a song number to see the album art associated with it (x to exit): ")
            if songSelection == "x":
                break
            trackSelectionList = []
            trackSelectionList.append(trackURIs[int(songSelection)])
            spotifyObj.start_playback(deviceID, None, trackSelectionList)
            # webbrowser.open(trackArt[int(songSelection)])
            print(trackArt[int(songSelection)])

    # end the program
    if choice == 1:
        sys.exit(2)


# print(json.dumps(VARIABLE, sort_keys=True, indent=4))
