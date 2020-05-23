import express from "express";
import morganLogger from "morgan";
import querystring from "querystring";
import axios from "axios";
import envalid, { str, num, url } from 'envalid'
import cookieParser from "cookie-parser";
import { generateRandomString } from "./utils";

const cleanEnv = envalid.cleanEnv(process.env, {
  PORT: num({ default: 1965 }),
  CLIENT_ID: str(),
  CLIENT_SECRET: str(),
  REDIRECT_URI: url(),
  SPOTIFY_STATE_KEY: str({ devDefault: "spotify_auth_state" }),
});

const port = cleanEnv.PORT || 1965;
const client_id = cleanEnv.CLIENT_ID;
const client_secret = cleanEnv.CLIENT_SECRET;
const redirect_uri = cleanEnv.REDIRECT_URI;
const stateKey = cleanEnv.SPOTIFY_STATE_KEY;

const app = express();

app
  .use(express.static(`${__dirname}/public`))
  .use(morganLogger("dev"))
  .use(cookieParser())
  .listen(port, () => console.log(`App running on port: ${port}`));

app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
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
  const options = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
    },
  };

  try {
    var { data } = await axios(options);
  } catch (e) {
    console.log(e);
    return res.redirect(
      `/#${querystring.stringify({
        error: "invalid_token",
      })}`
    );
  }

  res.redirect(
    `/#${querystring.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })}`
  );
});
