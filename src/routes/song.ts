import { Request, Response, Router } from "express";
import { Artist } from "../models/artist";
import { Song } from "../models/song";

class SongRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getSong = (req: Request, res: Response) => {
    const filter = req.query.name ? { name: req.query.name.toString() } : {};

    Song.find(filter)
      .then(async (result) => {
        if (result.length > 0) res.status(200).json(result);
        else res.status(404).json({ message: "Song/s not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  getSongById = (req: Request, res: Response) => {
    Song.findById(req.params.id)
      .then(async (result) => {
        if (result) res.status(200).json(result);
        else res.status(404).json({ message: "Song not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

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

  putSong = (req: Request, res: Response) => {
    Song.findByIdAndUpdate(req.params.id, req.body, {
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

  deleteSong = (req: Request, res: Response) => {
    Song.findByIdAndDelete(req.params.id)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  routes = () => {
    this.router.get("/song", this.getSong);
    this.router.get("/song/:id", this.getSongById);
    this.router.post("/song", this.postSong);
    this.router.put("/song/:id", this.putSong);
    this.router.delete("/song/:id", this.deleteSong);
  };
}

const songRoutes = new SongRoutes();
export default songRoutes.router;
