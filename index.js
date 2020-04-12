import express, { query } from "express";
import morganLogger from "morgan";
import querystring from "querystring";
import axios from "axios";
import cookieParser from "cookie-parser";

// setup envalid

const app = express();
const port = process.env.PORT || 1965;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
var stateKey = "spotify_auth_state";

app
  .use(express.static(`${__dirname}/public`))
  .use(morganLogger("combined"))
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
      Authorization: `Basic ${new Buffer(
        client_id + ":" + client_secret
      ).toString("base64")}`,
    },
  };

  try {
    var tokenAPIResponse = await axios(options);
  } catch (e) {
    console.log(e);
    return res.redirect(
      "/#" +
        querystring.stringify({
          error: "invalid_token",
        })
    );
  }
  // data: {
  //   access_token: 'BQCT_lObJGqToRm2CCa5AZs6XhqZGovGWT4HdbN4LA0qCiaPzM2l_7SLXocOwrpleYEpd8YnAp9-jERPzzz_wR5EE0bMedvTgBthkW5w7uw1f78DNbLqSChTYFzST26Xbofqcw8xqgE5JDEiKyAaoEGqT7f5w5n7JK7S7hGM1py2gYV-aw',
  //   token_type: 'Bearer',
  //   expires_in: 3600,
  //   refresh_token: 'AQCF1SLrX1VBxqmfeE75jxDtWWqh-VhylVnnX2i84Mx9X7ie8w8N8qxqOXHo9fovtYukI4pfPrqxqY72ocPkGgV8_SNNbNdgCowPF6VmiVekxZWl-dum8pDHPMJzawadWxc',
  //   scope: 'user-read-email user-read-private'
  // }
  console.log(tokenAPIResponse);
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
