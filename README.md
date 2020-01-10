# DJai
The app generates playlists based on user inputs like desired energy level and tempo. The app automatically syncs the beats of consecutive songs and crossfades them as if a real DJ mixed the tracks. 

Above is still the goal of this application. In the meantime, it is a playlist building application. 

## Installation
Run the following command to install all the required packages for `Python 3`.

    pip install -r requirements.txt

## Usage
Before running the application, 2 things need to be done. First, get your Spotify user id: 

1. Open the desktop Spotify application.
2. Click on your `name` on the upper right corner of the screen. 
3. A screen with your name and a bunch of playlists will show up. Click on the `...` below your name .
4. Click on `Share`.
5. Click on `Copy Profile Link`.
6. Open a browser and paste the link into the search bar.
7. Your Spotify user id is the sequnce of numbers after `user` in https://open.spotify.com/user/.
8. Enter your Spotify user id when prompted by DJai


Second, you will need to create your own Spotify Developers account and create an application to get access to Spotify API's while I figure out how to host the application online. You will need to create an app and do 3 things: get the `Client ID`, `Client Secret`, and set the callback URI under `Edit Settings` -> `Redirect URIs` to `http://localhost:8050/callback`.

Create a `.env` file and add your `Client ID` and `Client Secret` as so on their own lines: `CLIENT_ID=****************` and `CLIENT_SECRET=****************`. Now you are ready to use DJai.

To launch the Dash Application, run the following command: 

    python3 app.py

Open up a browser and go to http://localhost:8050/login to use DJai. 