import config from "./config";
import cookieParser from "cookie-parser";
import express from "express";
import morganLogger from "morgan";
import router from "./route";
const path = require("path");

const { PORT: port } = config;

const app = express();

app
  .use(express.static(`${__dirname}/public`))
  .use(morganLogger("dev"))
  .use(cookieParser())
  .use("/auth", router)
  .listen(port, () => console.log(`App running on port: ${port}`));
