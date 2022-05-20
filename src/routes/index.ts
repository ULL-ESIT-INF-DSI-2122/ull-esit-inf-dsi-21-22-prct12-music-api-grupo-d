import { Router } from "express";
import songRoutes from "./song";
import artistRoutes from "./artist";
import playlistRoutes from "./playlist";

/**
 * Clase Routes, que es la agrupacion de todas las rutas existentes en la API.
 */
export class Routes {
  public router: Router;
  /**
   * Ejecuta las demas funciones.
   */
  constructor() {
    this.router = Router();
    this.setRouters();
  }

  /**
   * Indica a router, que tiene que usar esas rutas.
   */
  setRouters = () => {
    this.router.use(songRoutes);
    this.router.use(artistRoutes);
    this.router.use(playlistRoutes);
  };
}

const routes = new Routes();
export default routes.router;
