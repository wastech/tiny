# tiny (WIP)

Convert Deezer playlists to Spotify playlist (and vice-versa).

Project built with a friend learning how to code.

## Setup

1. The app requires a user to login into their Spotify account.
We've chosen to use the OAuth authorization code flow.

To run this app, you need to get a Spotify app credentials so you can perfom this authorization flow.
To register your app, [click here](https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app) and follow the steps. At the end you will get a Client Id and a Client Secret.
You also need to set a redirect uri. Add `/callback` to whatever port you choose to run the app on.
Or stick to the value in `env.example`.

You can also read, Spotify's authorization guide [here](https://developer.spotify.com/documentation/general/guides/authorization-guide/).

2. Copy `.env.example` into `.env`. Then set your env vars.

3.  `npm install`, then `npm start`