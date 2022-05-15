import { Request, Response, Router } from "express";
import { Artist } from "../models/artist";
import ArtistI from "../models/interfaces/interfaceArtirst";
import { Song } from "../models/song";

class ArtistRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

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

  postArtist = async (req: Request, res: Response) => {
    const newArtist = new Artist({
      name: req.body.name,
      songs: req.body.songs,
    });

    await Promise.all(newArtist.songs.map(async song => {
      await Song.findByIdAndUpdate(song, {'artist': newArtist.name},{
        new: true,
      })
    }))

    newArtist
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
 

  // TODO: Revisar la actualizacion porque no se esta haciendo bien.
  // Se pone a 'Unknow Artist' todo
  putArtist = async (req: Request, res: Response) => {
    const updateArtist: ArtistI = {
      name: req.body.name,
      songs: req.body.songs,
    };

    if (req.body.songs) {

      // // Update Song Artist
      // await Promise.all(updateArtist.songs.map(async song => {
      //   await Song.findByIdAndUpdate(song, {'artist': updateArtist.name},{
      //     new: true,
      //   })
      // }))

      // Clear Song Artist
      await Promise.all([1].map(async _ => {
        const resArtist = await Artist.findById(req.params.id)
        if (resArtist && resArtist.songs.length > 0) {

          await Promise.all(resArtist.songs.map(async song => {
            await Song.findByIdAndUpdate(song, {'artist': 'Unknow Artist'},{
              new: true,
            })
          }))

          await Promise.all(updateArtist.songs.map(async song => {
            await Song.findByIdAndUpdate(song, {'artist': req.body.name ? req.body.name : resArtist.name},{
              new: true,
            })
          }))
        }
      }))

     
    }

    Artist.findByIdAndUpdate(req.params.id, req.body.songs ? updateArtist : {name: req.body.name}, {
      new: true,
    }).populate('songs').then((result) => {
      if (!result) {
        res.status(404).json({message: "Artist not Found"});
      } else {
        res.status(200).json(result);
      }
    }).catch((err) => {
      res.status(500).json({error: err});
    });
  };

  deleteArtist = async (req: Request, res: Response) => {
    await Promise.all([1].map(async _ => {
      const resArtist = await Artist.findById(req.params.id)
      if (resArtist && resArtist.songs.length > 0) {
        await Promise.all(resArtist.songs.map(async song => {
          await Song.findByIdAndUpdate(song, {'artist': 'Unknow Artist'},{
            new: true,
          })
        }))
      }
    }))

    Artist.findByIdAndDelete(req.params.id)
      .populate("songs")
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

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
