import { Request, Response, Router } from "express";
import { Artist } from "../models/artist";


/**
 * Clase que representa la agrupacion de rutas para los artistas
 */
class ArtistRoutes {
  public router: Router;

  /**
   * Inicializa las rutas
   */
  constructor() {
    this.router = Router();
    this.routes();
  }

  /**
   * Permite obtener los artistas, en caso de pasarle una query con un name,
   * se devuelve el artista con dicho nombre
   * @param req Request HTTP
   * @param res Response HTTP
   */
  getArtist = (req: Request, res: Response) => {
    const filter = req.query.name ? { name: req.query.name.toString() } : {};

    Artist.find(filter)
      .populate("songs")
      .then((result) => {
        if (result.length > 0) res.status(200).json(result);
        else res.status(404).json({ message: "Artist/s not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Permite obtener un artista a travez de si _id pasado como parametro.
   * @param req Request HTTP
   * @param res Response HTTP
   */
  getArtistById = (req: Request, res: Response) => {
    Artist.findById(req.params.id)
      .populate("songs")
      .then((result) => {
        if (result) res.status(200).json(result);
        else res.status(404).json({ message: "Artist not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Añade un nuevo artista a la colecion Artists de la Base de Datos
   * @param req Request HTTP
   * @param res Response HTTP
   */
  postArtist = (req: Request, res: Response) => {
    const newArtist = new Artist({
      name: req.body.name,
      songs: req.body.songs,
    });

    newArtist
      .save()
      .then((result) => {
        if (result) res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Dado in _id como parametro, puede actualizar todos los datos de dicho
   * objeto conincidento con la _id
   * @param req Request HTTP
   * @param res Response HTTP
   */
  putArtist = (req: Request, res: Response) => {
    Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("songs")
      .then((result) => {
        if (result) res.status(200).json(result);
        else res.status(404).json({ message: "Artist not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Dado un _id como parametro, elimina el objecto conincidente
   * @param req Request HTTP
   * @param res Response HTTP
   */
  deleteArtist = (req: Request, res: Response) => {
    Artist.findByIdAndDelete(req.params.id)
      .populate("songs")
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  /**
   * Indica a router, que tiene que usar esas rutas.
   */
  routes = () => {
    this.router.get("/artist", this.getArtist);
    this.router.get("/artist/:id", this.getArtistById);
    this.router.post("/artist", this.postArtist);
    this.router.put("/artist/:id", this.putArtist);
    this.router.delete("/artist/:id", this.deleteArtist);
  };
}

const artistRoutes = new ArtistRoutes();
export default artistRoutes.router;
