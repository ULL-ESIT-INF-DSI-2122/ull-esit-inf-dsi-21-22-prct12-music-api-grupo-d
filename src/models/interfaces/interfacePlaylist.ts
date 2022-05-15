import { ObjectId } from "mongoose";

export default interface PlaylistI {
  name: string;
  songs: ObjectId[];
}
