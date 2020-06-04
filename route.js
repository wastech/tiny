import express from "express";
import axios from "axios";
import { generateRandomString } from "./utils";
import querystring from "querystring";
import config from "./config";
const path = require("path");

const router = express.Router();

const {
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  REDIRECT_URI: redirectUri,
  SPOTIFY_STATE_KEY: stateKey,
} = config;

router.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const state = null;
  res.cookie(stateKey, state);

  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope,
      state,
    })}`
  );
});

router.get("/callback", async (req, res) => {
  const { state = null, code = null } = req.query;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    return res.sendFile("404.html", {
      root: path.join(__dirname, "./"),
    });
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

export default router;
