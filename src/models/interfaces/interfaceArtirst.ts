import { ObjectId } from "mongoose";

export default interface ArtistI {
  name: string;
  songs: ObjectId[];
}