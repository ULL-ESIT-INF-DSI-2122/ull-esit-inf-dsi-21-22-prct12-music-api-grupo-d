import { model, Schema } from "mongoose";
import SongI from "./interfaces/interfaceSong";
import { convertSegToHourMinSeg } from "./utils";

/**
 * Esquema de Mongoose que representa Song.
 */
export const SongSchema = new Schema(
  {
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
    genres: [
      {
        type: String,
        required: true,
      },
    ],
    single: {
      type: Boolean,
      required: true,
    },
    reproductions: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

/**
 * Se convierte la duracion de segundos a formato 00:00:00
 */
SongSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.duration = convertSegToHourMinSeg(returnedObject.duration);
  },
});

/**
 * Modelo de Cancion
 */
export const Song = model<SongI>("Song", SongSchema);
