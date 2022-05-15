import { model, Schema } from "mongoose";
import ArtistI from "./interfaces/interfaceArtirst";
import SongI from "./interfaces/interfaceSong";

export const ArtistSchema = new Schema({
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

// Calcula los generos y oyentes de un artista a la hora de mostrarlo
ArtistSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    const genres: string[] = []
    let listeners = 0
    if (returnedObject.songs && returnedObject.songs.length > 0 && returnedObject.songs[0].name) {
      returnedObject.songs.forEach((song: SongI) => {
        song.genres.forEach(genre => {
          if (!genres.includes(genre))
            genres.push(genre)
          listeners += song.reproductions
        })
      })
      returnedObject.genres = genres
      returnedObject.listeners = listeners
    } else {
      returnedObject.genres = []
      returnedObject.listeners = 0
    }
    
    returnedObject.songs?.forEach((_: any, index: number) => {
      // delete returnedObject.songs[index].artist
      delete returnedObject.songs[index]._id
    })

  }
})
  
export const Artist = model<ArtistI>('Artist', ArtistSchema);
