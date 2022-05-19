import { model, Schema } from "mongoose";
import SongI from "./interfaces/interfaceSong";

/**
 * Esquema de Mongoose que representa Song.
 */
export const SongSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  genres: [{
    type: String,
    required: true,
  }],
  single: {
    type: Boolean,
    required: true,
  },
  reproductions: {
    type: Number,
    required: true,
  }
},
{
  versionKey : false
});


/**
 * Se convierte la duracion de segundos a formato 00:00:00
 */
SongSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.duration = convertSegToHourMinSeg(returnedObject.duration)
  }
})

/**
 * Convierte de segundos a 00:00:00
 * @param duration Number Segundos que dura la cancion
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
 * Modelo de Cancion
 */
export const Song = model<SongI>('Song', SongSchema);
