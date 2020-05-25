/* eslint-disable no-process-env */
import envalid, { num, str, url } from "envalid";

export default envalid.cleanEnv(process.env, {
  CLIENT_ID: str(),
  CLIENT_SECRET: str(),
  PORT: num({ default: 1965 }),
  REDIRECT_URI: url(),
  SPOTIFY_STATE_KEY: str({ devDefault: "spotify_auth_state" }),
});
