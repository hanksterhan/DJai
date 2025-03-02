# DJai

## Usage

During development, a user will need to go to https://developer.spotify.com/dashboard and create an app to get a client id and client secret, and set the redirect uri to `http://localhost:4000/callback`. Put these credentials in the `DJAI/server/.env` file in the server directory under `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REDIRECT_URI`.

### Build Common Library

```bash
cd DJai/common
npm run build
```

### Start up the server

```bash
cd DJai/server
npm run watch
```

### Start up the web app in a new terminal window

```bash
cd DJai/web
npm run start
```
