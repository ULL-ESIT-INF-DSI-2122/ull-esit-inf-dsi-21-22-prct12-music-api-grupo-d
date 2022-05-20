import * as mongoose from "mongoose";
import * as express from "express";
import * as morgan from "morgan";
require("dotenv").config();
import { Request, Response } from "express";
import { join } from "path";

import routes from "./routes/index";
import { Song } from "./models/song";
import { Artist } from "./models/artist";
import { Playlist } from "./models/playlist";

/**
 * Clase que representa la Aplicacion
 */
export default class Server {
  /**
   * Instancia de la Aplicacion
   */
  private app: express.Application;

  /**
   * Constructor, que inicializa toda la Aplicacion
   * @param port Puerto de escucha de la API
   */
  constructor(private readonly port: number) {
    this.app = express();
    this.initApp();
    this.connectMongoDB();
  }

  /**
   * Funcion que carga la configuracion y las ruta que usara la API
   */
  initApp = () => {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(join(__dirname, "../public")));

    if (process.env.NODE_ENV === "test") {
      this.app.get("/reset", async (_: Request, res: Response) => {
        await Song.deleteMany({})
        await Artist.deleteMany({})
        await Playlist.deleteMany({})

        res.status(200).json({message: "Reset OK"})
      })
    }

    this.app.use(routes);
  };

  /**
   * Funcion que se encarga de establecer la conexion con MongoDB Atlas
   */
  connectMongoDB = () => {
    let MONGODB_URI: string = `mongodb+srv://admin:${process.env.PWDMONGO}@music-dsi.oqoxo.mongodb.net/Music-API?retryWrites=true&w=majority`;
    
    if (process.env.NODE_ENV === "test") {
      console.log("========== TEST ==========")
      MONGODB_URI = `mongodb+srv://admin:${process.env.PWDMONGO}@music-dsi.oqoxo.mongodb.net/Music-API-Test?retryWrites=true&w=majority`;
    }    
    
    const options = {
      autoIndex: true,
      useNewUrlParser: true,
    };
    mongoose
      .connect(MONGODB_URI, options)
      .then((_) => console.log("Database connected!"))
      .catch((_) => console.error("Error connecting to  te database"));
  };

  /**
   * Funcion que pone a la escucha la Aplicacion.
   */
  listen = () => {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log("Server is running on port: " + this.port);
    });
  };
}
