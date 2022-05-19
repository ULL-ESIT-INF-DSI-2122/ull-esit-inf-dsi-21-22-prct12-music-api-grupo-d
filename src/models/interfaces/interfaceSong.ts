import { ObjectId } from "mongoose";

/**
 * Interfaz implementada por las canciones.
 * @property name: Nombre de la canción de tipo string.
 * @property author: Autor de las canciones de tipo string.
 * @property duration: Duración de las canciones en segundos de tipo number.
 * @property genres: Vector de strings que representan los generos de la cancion.
 * @property single: Booleano para saber si la canción es un single o no.
 * @property reproductions: Número de reproducciones de la cancion.
 */
export default interface SongI {
  /**
   * @property Nombre
   */
  name: string;
  author: string;
  duration: number;
  genres: string[];
  single: boolean;
  reproductions: number;
}