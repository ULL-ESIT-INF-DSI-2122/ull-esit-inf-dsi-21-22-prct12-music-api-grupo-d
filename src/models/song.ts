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

SongSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.duration = convertSegToHourMinSeg(returnedObject.duration)
  }
})

const convertSegToHourMinSeg = (duration: number) => {
  let hour: number | string = parseInt((duration / 3600).toFixed(0));
  let min: number | string = parseInt((duration / 60).toFixed(0)) - 1;
  let seg: number | string = duration % 60;
  if (hour < 10 && hour > 0) hour = "0" + hour;
  if (min < 10 && min > 0) min = "0" + min;
  if (seg < 10 && seg > 0) seg = "0" + seg;

  return hour + ":" + min + ":" + seg
}

export const Song = model<SongI>('Song', SongSchema);
