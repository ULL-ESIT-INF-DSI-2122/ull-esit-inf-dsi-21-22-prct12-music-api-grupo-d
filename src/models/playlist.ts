import { model, Schema } from "mongoose";
import PlaylistI from "./interfaces/interfacePlaylist";
import SongI from "./interfaces/interfaceSong";

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

PlaylistSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    const genres: string[] = []
    let duration = 0
    if (returnedObject.songs && returnedObject.songs.length > 0 && returnedObject.songs[0].name) {
      returnedObject.songs.forEach((song: SongI) => {
        song.genres.forEach(genre => {
          if (!genres.includes(genre))
            genres.push(genre)
            duration += song.duration
        })
      })
      returnedObject.genres = genres
      returnedObject.duration = duration
    } else {
      returnedObject.genres = []
      returnedObject.duration = 0
    }

    returnedObject.songs?.forEach((_: any, index: number) => {
      delete returnedObject.songs[index]._id
    })
  }
})

export const Playlist = model<PlaylistI>('Playlist', PlaylistSchema);
