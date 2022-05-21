import { model, Schema } from "mongoose";
import PlaylistI from "./interfaces/interfacePlaylist";
import SongI from "./interfaces/interfaceSong";
import { convertStringHourToNumberSeg } from "./utils";

/**
 * Esquema de Mongoose que representa Playlist.
 */
export const PlaylistSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
  },
  {
    versionKey: false,
  }
);

/**
 * Modificamos la forma de mostrar los datos,
 * Añadiendo el dato generos, que es al concatenaciond e todos los generos de las canciones que hay, sin repetirlos.
 * Y la suma de la duracion de las canciones.
 */
PlaylistSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    const genres: string[] = [];
    let duration = "";
    if (
      returnedObject.songs &&
      returnedObject.songs.length > 0 &&
      returnedObject.songs[0].name
    ) {
      returnedObject.songs.forEach((song: SongI) => {
        song.genres.forEach((genre) => {
          if (!genres.includes(genre)) {
            genres.push(genre);
          }
          duration += song.duration + "|";
        });
      });
      returnedObject.genres = genres;
      returnedObject.duration = convertStringHourToNumberSeg(duration);
    } else {
      returnedObject.genres = [];
      returnedObject.duration = 0;
    }

    returnedObject.songs?.forEach((__: any, index: number) => {
      delete returnedObject.songs[index]._id;
    });
  },
});

/**
 * Modelo de la Playlist
 */
export const Playlist = model<PlaylistI>("Playlist", PlaylistSchema);
