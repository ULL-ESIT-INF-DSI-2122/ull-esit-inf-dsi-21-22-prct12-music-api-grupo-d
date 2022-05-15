import { ObjectId } from "mongoose";

export default interface SongI {
  name: string;
  author: string;
  duration: number;
  genres: string[];
  single: boolean;
  reproductions: number;
}