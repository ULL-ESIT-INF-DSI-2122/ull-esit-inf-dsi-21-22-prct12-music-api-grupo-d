import * as mongoose from "mongoose";
import * as express from "express";
import * as morgan from "morgan";
require("dotenv").config();
import { Request, Response } from "express";
import { join } from "path";

import routes from "./routes/index";

export default class Server {
  private app: express.Application;
  constructor(private readonly port: number) {
    this.app = express();
    this.initApp();
    this.connectMongoDB();
  }

  initApp = () => {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(join(__dirname, "../public")));

    this.app.use(routes);
  };

  connectMongoDB = () => {
    const options = {
      autoIndex: true,
      useNewUrlParser: true,
    };

    const MONGODB_URI: string = `mongodb+srv://admin:${process.env.PWDMONGO}@music-dsi.oqoxo.mongodb.net/Music-API?retryWrites=true&w=majority`;

    mongoose
      .connect(MONGODB_URI, options)
      .then((_) => console.log("Database connected!"))
      .catch((_) => console.error("Error connecting to  te database"));
  };

  listen = () => {
    this.app.listen(this.port, () => {
      console.log("Server is running on port: " + this.port);
    });
  };
}
