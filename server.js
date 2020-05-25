import axios from "axios";
import config from "./config";
import cookieParser from "cookie-parser";
import express from "express";
import { generateRandomString } from "./utils";
import morganLogger from "morgan";
import querystring from "querystring";

const {
  PORT: port,
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  REDIRECT_URI: redirectUri,
  SPOTIFY_STATE_KEY: stateKey,
} = config;

const app = express();

app
  .use(express.static(`${__dirname}/public`))
  .use(morganLogger("dev"))
  .use(cookieParser())
  .listen(port, () => console.log(`App running on port: ${port}`));

app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const state = generateRandomString();
  res.cookie(stateKey, state);

  res.redirect(
    `https://accounts.spotify.com/authorize?"${querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
      state,
    })}`
  );
});

app.get("/callback", async (req, res) => {
  const { state = null, code = null } = req.query;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    return res.redirect(
      `/#${querystring.stringify({ error: "state_mismatch" })}`
    );
  }

  res.clearCookie(stateKey);
  const { data } = await axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
  });

  return res.redirect(
    `/#${querystring.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })}`
  );
});
