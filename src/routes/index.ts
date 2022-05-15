import { Router } from "express";
import songRoutes from "./song";
import artistRoutes from "./artist";
import playlistRoutes from "./playlist";

export class Routes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.setRouters();
  }

  setRouters = () => {
    this.router.use(songRoutes);
    this.router.use(artistRoutes);
    this.router.use(playlistRoutes);
  };
}

const routes = new Routes();
export default routes.router;
