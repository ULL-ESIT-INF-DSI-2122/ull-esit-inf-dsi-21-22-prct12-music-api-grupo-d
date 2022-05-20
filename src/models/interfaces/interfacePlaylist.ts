import { ObjectId } from "mongoose";

/**
 * Interfaz implementada por las listas de reproducción.
 * @property name: Nombre de la lista de reproducción de tipo string.
 * @property songs: Vector de ObjectId de mongoose.
 */
export default interface PlaylistI {
  name: string;
  songs: ObjectId[];
}
