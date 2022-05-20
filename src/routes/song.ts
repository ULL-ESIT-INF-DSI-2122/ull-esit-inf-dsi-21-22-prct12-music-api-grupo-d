import { Request, Response, Router } from "express";
import { Song } from "../models/song";

/**
 * Clase que representa la agrupacion de rutas para las canciones
 */
class SongRoutes {
  public router: Router;

  /**
   * Inicializa las rutas
   */
  constructor() {
    this.router = Router();
    this.routes();
  }

  /**
   * Permite obtener las canciones, en caso de pasarle una query con un NAME,
   * se devuelve la cancion con dicho nombre
   * @param req Request HTTP
   * @param res Response HTTP
   */
  getSong = (req: Request, res: Response) => {
    const filter = req.query.name ? { name: req.query.name.toString() } : {};

    Song.find(filter)
      .then((result) => {
        if (result.length > 0) res.status(200).json(result);
        else res.status(404).json({ message: "Song/s not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Añade una nueva cancion a la colecion Songs de la Base de Datos
   * @param req Request HTTP
   * @param res Response HTTP
   */
  postSong = (req: Request, res: Response) => {
    const newSong = new Song({
      name: req.body.name,
      author: req.body.author,
      duration: req.body.duration,
      genres: req.body.genres,
      single: req.body.single,
      reproductions: req.body.reproductions,
    })

    newSong
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Dado un NAME como query, puede actualizar todos los datos de dicho
   * objeto conincidento con el NAME
   * @param req Request HTTP
   * @param res Response HTTP
   */
  putSong = (req: Request, res: Response) => {
    Song.findOneAndUpdate({name: req.query.name}, req.body, {
      new: true,
    })
      .then((result) => {
        if (result) res.status(200).json(result);
        else res.status(404).json({ message: "Song not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

   /**
   * Dado un NAME como query, elimina el objecto conincidente
   * @param req Request HTTP
   * @param res Response HTTP
   */
  deleteSong = (req: Request, res: Response) => {
    Song.findOneAndDelete({name: req.query.name})
      .then((result) => {
        if (result) res.status(200).json(result)
        else res.status(404).json({ message: "Song not Found" })
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Indica a router, que tiene que usar esas rutas.
   */
  routes = () => {
    this.router.get("/song", this.getSong);
    this.router.post("/song", this.postSong);
    this.router.put("/song", this.putSong);
    this.router.delete("/song", this.deleteSong);
  };
}

const songRoutes = new SongRoutes();
export default songRoutes.router;
