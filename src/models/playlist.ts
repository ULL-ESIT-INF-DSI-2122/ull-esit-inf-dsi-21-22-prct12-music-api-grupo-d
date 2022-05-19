import { model, Schema } from "mongoose";
import PlaylistI from "./interfaces/interfacePlaylist";
import SongI from "./interfaces/interfaceSong";

/**
 * Esquema de Mongoose que representa Playlist.
 */
export const PlaylistSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }]
},
{
  versionKey : false
});

/**
 * Modificamos la forma de mostrar los datos,
 * Añadiendo el dato generos, que es al concatenaciond e todos los generos de las canciones que hay, sin repetirlos.
 * Y la suma de la duracion de las canciones.
 */
PlaylistSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    const genres: string[] = []
    let duration: string = ""
    if (returnedObject.songs && returnedObject.songs.length > 0 && returnedObject.songs[0].name) {
      returnedObject.songs.forEach((song: SongI) => {
        song.genres.forEach(genre => {
          if (!genres.includes(genre))
            genres.push(genre)
            duration += song.duration + "|"
        })
      })
      returnedObject.genres = genres
      returnedObject.duration = convertStringHourToNumberSeg(duration)
    } else {
      returnedObject.genres = []
      returnedObject.duration = 0
    }

    returnedObject.songs?.forEach((_: any, index: number) => {
      delete returnedObject.songs[index]._id
    })
  }
})

/**
 * Convierte una string del tipo "00:00:00 | 00:00:00" a segundos en numeros
 * @param duration String Duracion de cada cancion.
 * @returns Resultado de la @method convertSegToHourMinSeg
 */
const convertStringHourToNumberSeg = (duration: string) => {
  let totalDuration: number = 0
  const durationSongs = duration.split("|")
  durationSongs.splice(durationSongs.length -1, 1)
  console.log("Duracion de las canciones: ", durationSongs);
  
  durationSongs.forEach(durationSong => {
    const partdurationSong = durationSong.split(":")
    totalDuration += parseInt(partdurationSong[0]) * 3600 + parseInt(partdurationSong[1]) * 60 + parseInt(partdurationSong[2])
  })
  
  return convertSegToHourMinSeg(totalDuration)
}

/**
 * Convierte de segundos a 00:00:00
 * @param duration Number Segundos
 * @returns String 00:00:00
 */
const convertSegToHourMinSeg = (duration: number) => {
  let hour: number | string = parseInt((duration / 3600).toFixed(0));
  let min: number | string = parseInt((duration / 60).toFixed(0)) - 1;
  let seg: number | string = duration % 60;
  if (hour < 10 && hour >= 0) hour = "0" + hour;
  if (min < 10 && min >= 0) min = "0" + min;
  if (seg < 10 && seg >= 0) seg = "0" + seg;

  return hour + ":" + min + ":" + seg
}

/**
 * Modelo de la Playlist
 */
export const Playlist = model<PlaylistI>('Playlist', PlaylistSchema);
