import { Request, Response, Router } from "express";
import { Playlist } from "../models/playlist";


/**
 * Clase que representa la agrupacion de rutas para las playlists
 */
class PlaylistRoutes {
  public router: Router;

  /**
   * Inicializa las rutas
   */
  constructor() {
    this.router = Router();
    this.routes();
  }

  /**
   * Permite obtener las playlists, en caso de pasarle una query con un NAME,
   * se devuelve la playlist con dicho nombre
   * @param req Request HTTP
   * @param res Response HTTP
   */
  getPlaylist = (req: Request, res: Response) => {
    const filter = req.query.name ? { name: req.query.name.toString() } : {};

    Playlist.find(filter)
      .populate("songs")
      .then((result) => {
        if (result.length > 0) res.status(200).json(result);
        else res.status(404).json({ message: "Playlist/s not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Añade una nueva playlist a la colecion Playlists de la Base de Datos
   * @param req Request HTTP
   * @param res Response HTTP
   */
  postPlaylist = (req: Request, res: Response) => {
    const newPlaylist = new Playlist({
      name: req.body.name,
      songs: req.body.songs,
    });

    newPlaylist
      .save()
      .then((result) => {
        if (result) res.status(201).json(result);
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
  putPlaylist = (req: Request, res: Response) => {
    Playlist.findOneAndUpdate({name: req.query.name}, req.body, {
      new: true,
    })
      .populate("songs")
      .then((result) => {
        if (result) res.status(200).json(result);
        else res.status(404).json({ message: "Playlist not Found" });
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
  deletePlaylist = (req: Request, res: Response) => {
    Playlist.findOneAndDelete({name: req.query.name})
      .populate("songs")
      .then((result) => {
        if (result) res.status(200).json(result)
        else res.status(404).json({ message: "Playlist not Found" })
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };
  
  /**
   * Indica a router, que tiene que usar esas rutas.
   */
  routes = () => {
    this.router.get("/playlist", this.getPlaylist);
    this.router.post("/playlist", this.postPlaylist);
    this.router.put("/playlist", this.putPlaylist);
    this.router.delete("/playlist", this.deletePlaylist);
  };
}

const playlistRoutes = new PlaylistRoutes();
export default playlistRoutes.router;
