import { Request, Response, Router } from "express";
import { Artist } from "../models/artist";
import { Song } from "../models/song";

class SongRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }
  
  // await Promise.all([1].map(async _ => {
  //   if (result) {
  //     const resultArtist = await Artist.findOne({songs: {$in: result._id}})
  //     if (resultArtist)
  //       result["artist"] = resultArtist.name
  //   }
  // }))

  getSong = (req: Request, res: Response) => {
    const filter = req.query.name ? {name: req.query.name.toString()} : {}

    Song.find(filter).then(async result => {
      if (result.length > 0)
        res.status(200).json(result)
      else
        res.status(404).json({message: "Song/s not Found"})
    }).catch(err => {
      res.status(500).json({error: err})
    })
  };

  getSongById = (req: Request, res: Response) => {
    Song.findById(req.params.id).then(async result => {
      if (result)
        res.status(200).json(result)
      else
        res.status(404).json({message: "Song not Found"})
    }).catch(err => {
      res.status(500).json({error: err})
    })
  };

  postSong = (req: Request, res: Response) => {
    const newSong = new Song({
      name: req.body.name,
      artist: 'Unknow Artist',
      duration: req.body.duration,
      genres: req.body.genres,
      single: req.body.single,
      reproductions: req.body.reproductions,
    })

    newSong.save().then(result => {
      res.status(201).json(result)
    }).catch(err => {
      res.status(500).json({error: err})
    })
  };

  putSong = (req: Request, res: Response) => {
    const allowedUpdates = ['name', 'duration', 'genres', 'single', 'reproductions'];
    const requestUpdates = Object.keys(req.body);
    const isValidUpdate = requestUpdates.every(update => allowedUpdates.includes(update));

      if (!isValidUpdate) {
        res.status(400).json({error: 'Please enter a valid update'});
      } else {
        Song.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        }).then((result) => {
          if (!result) {
            res.status(404).json({message: "Song/s not Found"});
          } else {
            res.status(200).json(result);
          }
        }).catch((err) => {
          res.status(500).json({error: err});
        });
      }
  };

  deleteSong = (req: Request, res: Response) => {
    Song.findByIdAndDelete(req.params.id).then(result => {
      res.status(200).json(result)
    }).catch(err => {
      res.status(500).json({error: err})
    })
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
