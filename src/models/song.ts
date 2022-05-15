import { model, Schema } from "mongoose";
import { Artist } from "./artist";
import SongI from "./interfaces/interfaceSong";

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

export const Song = model<SongI>('Song', SongSchema);
