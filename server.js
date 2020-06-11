import config from "./config";
import cookieParser from "cookie-parser";
import express from "express";
import morganLogger from "morgan";
import router from "./route";

const { PORT: port } = config;

const app = express();

app
  .use(express.static(`${__dirname}/public`))
  .use(morganLogger("dev"))
  .use(cookieParser())
  .use("/auth", router)
  .use((err, req, res, next) => {
    console.log("err", err);
    res.redirect("/error.html");
  })
  .listen(port, () => console.log(`App running on port: ${port}`));
