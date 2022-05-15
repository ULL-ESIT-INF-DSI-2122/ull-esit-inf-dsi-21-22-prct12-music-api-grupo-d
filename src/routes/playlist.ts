import { Request, Response, Router } from "express";
import PlaylistI from "../models/interfaces/interfacePlaylist";
import { Playlist } from "../models/playlist";
import { Song } from "../models/song";

class PlaylistRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

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

  getPlaylistById = (req: Request, res: Response) => {
    Playlist.findById(req.params.id)
      .populate('songs')
      .then(result => {
        if (result)
          res.status(200).json(result)
        else
          res.status(404).json({message: "Playlist not Found"})
      }).catch(err => {
        res.status(500).json({error: err})
      })
  };

  postPlaylist = async (req: Request, res: Response) => {
    const newPlaylist = new Playlist({
      name: req.body.name,
      songs: req.body.songs,
    });

    newPlaylist
      .save()
      .then((result) => {
        if (result) {
          res.status(201).json(result);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  putPlaylist = async (req: Request, res: Response) => {
    const updatePlaylist: PlaylistI = {
      name: req.body.name,
      songs: req.body.songs,
    };

    Playlist.findByIdAndUpdate(req.params.id, req.body.songs ? updatePlaylist : {name: req.body.name}, {
      new: true,
    }).populate('songs').then((result) => {
      if (!result) {
        res.status(404).json({message: "Playlist not Found"});
      } else {
        res.status(200).json(result);
      }
    }).catch((err) => {
      res.status(500).json({error: err});
    });
    
  };

  deletePlaylist = (req: Request, res: Response) => {
    Playlist.findByIdAndDelete(req.params.id)
      .populate("songs")
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  routes = () => {
    this.router.get("/playlist", this.getPlaylist);
    this.router.get("/playlist/:id", this.getPlaylistById);
    this.router.post("/playlist", this.postPlaylist);
    this.router.put("/playlist/:id", this.putPlaylist);
    this.router.delete("/playlist/:id", this.deletePlaylist);
  };
}

const playlistRoutes = new PlaylistRoutes();
export default playlistRoutes.router;
