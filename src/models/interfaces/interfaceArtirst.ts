import { ObjectId } from "mongoose";

/**
 * Interfaz implementada por los artistas.
 * @property name: Nombre de los artistas en atributo string.
 * @property songs: Vector de ObjectId de mongoose.
 */
export default interface ArtistI {
  name: string;
  songs: ObjectId[];
}
