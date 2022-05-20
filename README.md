# Informe Práctica 12
## API Node/Express de gestión de información musical

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct12-music-api-grupo-d/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct12-music-api-grupo-d/actions/workflows/ci-cd.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct07-music-datamodel-grupo-d&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct12-music-api-grupo-d)

Link de la [API](https://api-music-dsi.herokuapp.com/) desplegada en Heroku.

---

## Autores: 

Yeixon Morales Gonzalez | alu0101133324@ull.edu.es

Vlatko Jesús Marchán Sekulic | alu0101321141@ull.edu.es

Nicolas Vegas Rodriguez | alu0101321745@ull.edu.es

Luciano Sekulic Gregoris | alu0101022239@ull.edu.es

---


### 1. Introducción de la práctica.

Se nos propone llevar a cabo una API de gestión de información musical. Para dicho desarrollo se utilizarán principalmente los paquetes _mongoose_ (para la conexion con labase de datos) y _express_ (para la configuración del servidor de la API).

>Ir al punto 3.3.1 para llevar acabo la ejecucion correcta de la aplicacion.

---

### 2 Organización del grupo.

Para el desarrollo de la práctica todos los integrantes del grupo se han encargado de diferentes tareas para la creación del programa, para ello se ha repartido de manera equitativa la documentación y el desarrollo del codigo.

![Consola](./assets/imagen1.png)

---

#### 2.1 Método de desarollo.

Todos los integrantes del grupo nos hemos conectado mediante el uso de ssh a un servidor del compañero Yeixon Morales, por este motivo la mayoría de commits del desarrollo son realizados desde su cuenta github.

---

### 3 Planteamiento del trabajo.

#### 3.1 Relaciones entre las entidades.

Para el desarrollo de la practica se nos enumeran una serie de requisitos que debe contener la API a desarrollar. De estos datos de ha extraido el siguiente modelo:

![Relaciones](./assets/imagen2.png)

En el cual se pueden ver las relaciones que existen entre las distintas entidades. donde:

* __Song:__ Será la entidad que represente a las canciones dentro de nuestra API. Y tendrá los siguientes atributos:

   * _name_ : Nombre de la canción 
   * _autor_ : Nombre del autor de la canción.
   * _duration_ : duración de la canción (En segundos).
   * _genres_ : genero de la canción.
   * _single_ : booleano que notificará la canción es un sigle.
   * _reproductions_ : número de reproducciones que ha tenido la canción.

> Cabe remarcar que se ha intepretado que el autor de la canción es el que la compuso. 
> Mientras que el artista es el que la interpreta. Por lo que autor puede ser distinto de artista.

* __Artist:__ Será la entidad que represente los artistas de nuestra API. y tendrá los siguientes atributos:

   * _name_ : Nombre del artista
   * _songs_ : Vector de las canciones interpretadas por el artista.
   * _genres_ : Concatenación de generos de las canciones (Este se calculará a partir del vector de las canciones)
   * _listeners_ : Suma de las reproducciones de las canciones (Este se calculará a partir del vector de las canciones)

* __Playlist:__ Será la entidad que represente Las Playlist de nuestra API. y tendrá los siguientes atributos:

   * _name_ : Nombre de la playlist
   * _songs_ : Vector de las canciones en la playlist.
   * _genres_ : Concatenación de generos de las canciones (Este se calculará a partir del vector de las canciones)
   * _duration_ : Suma de la duracion de las canciones (Este se calculará a partir del vector de las canciones)

Una vez recopilados los requisitos que debe contener nuestra aplicación procedemos al desarrollo de la misma.

---

#### 3.2 Implementación del Server (Express).

Para poder implementar la API correctamente es necesario la creación de un server que nos sirva una API de HTTP basada en JSON. Para ello se utiliza el _framework Web_ de Node.js __Express__ que nos permite crear servidores web de un modo sencillo.a

Para ello creamos la __Clase Server__ la cual constará con:

* __Constructor:__  EL constructor recibe el puerto al que queremos escuchar con el servidor y se guardará en un atributo privado, por otro lado crearemos el objeto express que se guardará en el atributo _app_ y llamará a los métodos __initApp__ y __connectMongoDB__ que se explicarán a continuación.

```typescript
private app: express.Application;
constructor(private readonly port: number) {
    this.app = express();
    this.initApp();
    this.connectMongoDB();
  }
```

* __initApp:__ Función que inicializa toda la API estableciendo ciertas características y rutas. Lass características se definen en las primeras 4 líneas, _morgan_ permite ver las peticiones que recibe la API, _express.json()_ Analiza las solicitudes entrantes con cargas JSON, _express.urlencoded({ extended: false }_  Analiza las requests entrantes con cargas útiles codificadas en urlencoded y se basa en body-parser. _express.static(join(\_\_dirname, "../public")_ sirve los archivos estáticos. Por otro lado, en caso de que se inicie la aplicación en modo _test_ se le añadirá un __endpoint__ que permitirá reiniciar todo el contenido de la colección test en la base de datos. Y por ultimo se le dice a la API que utilice ciertas rutas (Que se mencionarán mas adelante en el punto 3.4)

```typescript
  initApp = () => {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(join(__dirname, "../public")));

    if (process.env.NODE_ENV === "test") {
      this.app.get("/reset", async (_: Request, res: Response) => {
        await Song.deleteMany({})
        await Artist.deleteMany({})
        await Playlist.deleteMany({})

        res.status(200).json({message: "Reset OK"})
      })
    }

    this.app.use(routes);
  };
```

* __connectMongoDB:__ Función encargada de conectarse a la base de datos de __MongoDB Atlas__ para ello usamos _mongoose_ con su función _connect_ a la que le pasaremos la URI de la base de datos y unas opciones, en concreto _autoIndex_ que genera un _\_id_ automáticamente. Con lo que respecta al process.env se explicará más delante en el informe, concretamente en el punto 3.3.1

```typescript
  connectMongoDB = () => {
    let MONGODB_URI: string = `mongodb+srv://admin:${process.env.PWDMONGO}@music-dsi.oqoxo.mongodb.net/Music-API?retryWrites=true&w=majority`;
    
    if (process.env.NODE_ENV === "test") {
      MONGODB_URI = `mongodb+srv://admin:${process.env.PWDMONGO}@music-dsi.oqoxo.mongodb.net/Music-API-Test?retryWrites=true&w=majority`;
    }    
    
    const options = {
      autoIndex: true,
      useNewUrlParser: true,
    };
    mongoose
      .connect(MONGODB_URI, options)
      .then((_) => console.log("Database connected!"))
      .catch((_) => console.error("Error connecting to  te database"));
  };
```

* __listen:__ Hace que el servidor escuche las peticiones en el puerto que se le pase por el constructor.

```typescript
listen = () => {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log("Server is running on port: " + this.port);
    });
  };
```


---

#### 3.3 Implementación de la base de datos (mongoose).
##### 3.3.1 .env

Por seguridad y no publicar la contraseña de la URI para conectarse a la base de datos del __MongoDB Atlas__ en github se optó por crear el fichero _.env_ el cual contiene la contraseña de dicho servico.

Para que nos funcione deberemos crear el fichero _.env_ y poner el contenido de la siguiente manera:

```
PWDMONGO = "Aquí iría la contraseña"
```

> Dicha contraseña, se les pondra en un comentario a la hora de la entrega.

Por otro lado, tal y como se pudo ver en el método de __connectMongoDB__ se utiliza _process.env.NODE\_ENV_ este permite ejecutar la API en diferentes modos, tal y como se puede observar en el __package.json__ 

```typescript
"server-test": "cross-env NODE_ENV=test node dist/index.js",
"server-dev": "tsc-watch --onSuccess \"cross-env NODE_ENV=dev node dist/index.js\"",
"server": "cross-env NODE_ENV=production node dist/index.js",
```

##### 3.3.2 Modelos

Para poder trabjar correctamente con nuestra bases de datos de MongoDB Atlas es necesario crear una serie de modelos para cada uno de los datos.

Primero fue necesario crear una serie de interfaces que definieran los atributos que debía contener cada entidad:

* __interfaceArtist:__ La entidad tan solo necesitará almacenar el nombre del artita y un vector con las _ObjectId_ de las canciones del mismo

```typescript
import { ObjectId } from "mongoose";

export default interface ArtistI {
  name: string;
  songs: ObjectId[];
}
```

* __interfacePlaylist:__ La entidad tan solo necesitará almacenar el nombre de la playlist y un vector con las _ObjectId_ de las canciones del mismo

```typescript
import { ObjectId } from "mongoose";

export default interface PlaylistI {
  name: string;
  songs: ObjectId[];
}
```

* __interfaceSong:__ La entidad necesitará almacenar el nombre, autor, duración, géneros y número de reproducciones de la canción y si la canción se trata de un sigle.

```typescript
export default interface SongI {
  name: string;
  author: string;
  duration: number;
  genres: string[];
  single: boolean;
  reproductions: number;
}
```

> Destacar que, ne se extendio las interfaces de Document, ya que, la misma documentacion dice que no es recomendado. [Link](https://mongoosejs.com/docs/typescript.html#using-extends-document)

Tras crear las interfaces procedemos a crear el Schema para __mongoose__ de cada entidad.

* __Artist:__ Primero creamos el Schema de la entidad Artist.

```ts
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
```

Desactivamos la _versionKey_ ya que no nos interesa

Posteriormente modificamos el _toJSON_ para poder modificar el resultado que se le muestra al usuario. En el caso de artista se encargará de calcular automáticamente los generos y oyentes basados en el vector de música que alamacena la entidad.
```ts
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
      delete returnedObject.songs[index]._id
    })

  }
})
```

Tras esto creamos el modelo.

```ts
export const Artist = model<ArtistI>('Artist', ArtistSchema);
```

* __Playlist:__ Como en la anterior, creamos el esquema de Playlist.

```ts
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
```

Posteriormente modificamos el _toJSON_ para poder modificar el resultado que se le muestra al usuario. Al igual que el anterior vamos a realizar cáculos para mostrarselos al usuario y en playlist lo mismo que artistas pero tomamos la duración de cada canción y la sumamos.

```ts
PlaylistSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    const genres: string[] = []
    let duration: string = ""
    if (returnedObject.songs && returnedObject.songs.length > 0 && returnedObject.songs[0].name) {
      returnedObject.songs.forEach((song: SongI) => {
        song.genres.forEach(genre => {
          if (!genres.includes(genre))
            genres.push(genre)
            duration += song.duration + "|"
        })
      })
      returnedObject.genres = genres
      returnedObject.duration = convertStringHourToNumberSeg(duration)
    } else {
      returnedObject.genres = []
      returnedObject.duration = 0
    }

    returnedObject.songs?.forEach((_: any, index: number) => {
      delete returnedObject.songs[index]._id
    })
  }
})
```

Para llevar acabo la suma de la duracion de las canciones, tuvimos que tomar la duracion de las canciones, que ya venian en un formato HH:MM:SS y ser capaz de sumar todo esto y dar un tiempo total, para eso se creo la funcion _convertStringHourToNumberSeg_ que pasaba de el formato HH:MM:SS a un numero de segundos, apra luego sumarlos y pasarlo a otra funcion _convertSegToHourMinSeg_ que convierte los segundos en el formato HH:MM:SS


```ts
const convertStringHourToNumberSeg = (duration: string) => {
  let totalDuration: number = 0
  const durationSongs = duration.split("|")
  durationSongs.splice(durationSongs.length -1, 1)
  
  durationSongs.forEach(durationSong => {
    const partdurationSong = durationSong.split(":")
    totalDuration += parseInt(partdurationSong[0]) * 3600 + parseInt(partdurationSong[1]) * 60 + parseInt(partdurationSong[2])
  })
  
  return convertSegToHourMinSeg(totalDuration)
}

const convertSegToHourMinSeg = (duration: number) => {
  let hour: number | string = parseInt((duration / 3600).toFixed(0));
  let min: number | string = parseInt((duration / 60).toFixed(0)) - 1;
  let seg: number | string = duration % 60;
  if (hour < 10 && hour > 0) hour = "0" + hour;
  if (min < 10 && min > 0) min = "0" + min;
  if (seg < 10 && seg > 0) seg = "0" + seg;

  return hour + ":" + min + ":" + seg
}
```

Tras esto creamos el modelo.

```ts
export const Playlist = model<PlaylistI>('Playlist', PlaylistSchema);
```

* __Song__ Como en la anterior, creamos el esquema de Song.

```ts
export const SongSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  genres: [{
    type: String,
    required: true,
  }],
  single: {
    type: Boolean,
    required: true,
  },
  reproductions: {
    type: Number,
    required: true,
  }
},
{
  versionKey : false
});
```

Modificamos el _toJSON_ para modificar lo que que mostraremos al usuario. Para ello tomamos la duración de la canción y la convertimos en el formato 00:00:00 haciendo uso de la función _convertSegToHourMinSeg_

```ts
SongSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.duration = convertSegToHourMinSeg(returnedObject.duration)
  }
})

const convertSegToHourMinSeg = (duration: number) => {
  let hour: number | string = parseInt((duration / 3600).toFixed(0));
  let min: number | string = parseInt((duration / 60).toFixed(0)) - 1;
  let seg: number | string = duration % 60;
  if (hour < 10 && hour > 0) hour = "0" + hour;
  if (min < 10 && min > 0) min = "0" + min;
  if (seg < 10 && seg > 0) seg = "0" + seg;

  return hour + ":" + min + ":" + seg
}
```

Tras esto creamos el modelo.

```ts
export const Song = model<SongI>('Song', SongSchema);
```

---
#### 3.4 Routes.
En en archivo _index.ts_ se va a encontrar la clase ***Routes*** donde se importan una instancia de rutas de las clases songRoutes, artistRoutes y playlistRoutes, indicando que la variable router tiene que usar todas las rutas que contienen las otras instancias. Para luego indicarle a la Aplicacion las rutas a usar.

```ts
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
```

* __artist:__ Aunque la clase ***artistRoutes*** contiene más funciones, la explicación solo se va a centrar en ***routes*** ya que las demás se explicarán en el apartado 3.5. En la funcion ***routes** se especifica al router, que funcion tiene que ejecutar cuando se acceda a alguna de las rutas que posee.

```ts
class ArtistRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getArtist = (req: Request, res: Response) => {
  };

  postArtist = async (req: Request, res: Response) => {
  };

  putArtist = async (req: Request, res: Response) => {
  };

  deleteArtist = async (req: Request, res: Response) => {
  };

  routes = () => {
    this.router.get("/artist", this.getArtist);
    this.router.post("/artist", this.postArtist);
    this.router.put("/artist", this.putArtist);
    this.router.delete("/artist", this.deleteArtist);
  };
}

const artistRoutes = new ArtistRoutes();
export default artistRoutes.router;
```

* __playlist:__ En la clase ***playlistRoutes*** se realiza el mismo estilo de rutas y se han seguido las mismas pautas. Como en el fichero anterior, las funciones crud se explicarán en el siguiente apartado. 

```ts
class PlaylistRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getPlaylist = (req: Request, res: Response) => {
  };

  postPlaylist = async (req: Request, res: Response) => {
  };

  putPlaylist = async (req: Request, res: Response) => {
  };

  deletePlaylist = (req: Request, res: Response) => {
  };

  routes = () => {
    this.router.get("/playlist", this.getPlaylist);
    this.router.post("/playlist", this.postPlaylist);
    this.router.put("/playlist", this.putPlaylist);
    this.router.delete("/playlist", this.deletePlaylist);
  };
}

const playlistRoutes = new PlaylistRoutes();
export default playlistRoutes.router;

```

* __song:__ En la clase ***songRoutes*** se realiza el mismo estilo de rutas y se han seguido las mismas pautas. Como en el fichero anterior, las funciones crud se explicarán en el siguiente apartado. 

```ts
class SongRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getSong = (req: Request, res: Response) => {
  };

  postSong = (req: Request, res: Response) => {
  };

  putSong = (req: Request, res: Response) => {
  };

  deleteSong = (req: Request, res: Response) => {
  };

  routes = () => {
    this.router.get("/song", this.getSong);
    this.router.post("/song", this.postSong);
    this.router.put("/song", this.putSong);
    this.router.delete("/song", this.deleteSong);
  };
}

const songRoutes = new SongRoutes();
export default songRoutes.router;
```
---
#### 3.5 Operaciones CRUD.
Las operaciones CRUD (Create, Read, Update, Delete), son fundamentales para que una aplicación pueda funcionar correctamente. Se consigue mediante el uso de rutas que son las encargadas de las funciones requeridas.

* __artist:__ 

- __getArtist:__ Esta función requiere un nombre para devolverte al artista, sino te devuelve una lista de artistas que hay. Cabe destacar que ***.populate()*** se utiliza para mostrar los datos de lo que se le referencia, en este caso de ***songs***. 
 
```ts
getArtist = (req: Request, res: Response) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  Artist.find(filter)
    .populate("songs")
    .then((result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "Artist/s not Found" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```

- __postArtist:__ Esta función tiene como cometido "crear" un nuevo artista en el cual se requiere un nombre y sus canciones.

```ts
postArtist = async (req: Request, res: Response) => {
  const newArtist = new Artist({
    name: req.body.name,
    songs: req.body.songs,
  });

  newArtist
    .save()
    .then((result) => {
      if (result) res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```

- __putArtist:__ Esta función busca un artista por su nombre y lo actualiza para luego mediante ***populate()***  muestre todas sus canciones.

```ts
putArtist = (req: Request, res: Response) => {
  Artist.findOneAndUpdate({name: req.query.name as String}, req.body, {
    new: true,
  })
    .populate("songs")
    .then((result) => {
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: "Artist not Found" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```

- __deleteArtist:__ Esta función elimina un artista ya existente y muestra su información para que si por algun motivo se borra sin querer hacerlo, haya una manera de poder recuperarse. 

```ts
deleteArtist = (req: Request, res: Response) => {
  Artist.findOneAndDelete({name: req.query.name})
    .populate("songs")
    .then((result) => {
      if (result) res.status(200).json(result)
      else res.status(404).json({ message: "Artist not Found" })
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```

* __playlist:__ Este archivo realiza las mismas funciones que ***artist.ts*** pero con las playlist.

```ts
class PlaylistRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  getPlaylist = (req: Request, res: Response) => {
    const filter = req.query.name ? { name: req.query.name.toString() } : {};

    Playlist.find(filter)
      .populate("songs")
      .then((result) => {
        if (result.length > 0) res.status(200).json(result);
        else res.status(404).json({ message: "Playlist/s not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  postPlaylist = async (req: Request, res: Response) => {
    const newPlaylist = new Playlist({
      name: req.body.name,
      songs: req.body.songs,
    });

    newPlaylist
      .save()
      .then((result) => {
        if (result) res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  putPlaylist = (req: Request, res: Response) => {
    Playlist.findOneAndUpdate({name: req.query.name}, req.body, {
      new: true,
    })
      .populate("songs")
      .then((result) => {
        if (result) res.status(200).json(result);
        else res.status(404).json({ message: "Playlist not Found" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  deletePlaylist = (req: Request, res: Response) => {
    Playlist.findOneAndDelete({name: req.query.name})
      .populate("songs")
      .then((result) => {
        if (result) res.status(200).json(result)
        else res.status(404).json({ message: "Playlist not Found" })
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  };

  routes = () => {
    this.router.get("/playlist", this.getPlaylist);
    this.router.get("/playlist/:id", this.getPlaylistById);
    this.router.post("/playlist", this.postPlaylist);
    this.router.put("/playlist/:id", this.putPlaylist);
    this.router.delete("/playlist/:id", this.deletePlaylist);
  };
}

const playlistRoutes = new PlaylistRoutes();
export default playlistRoutes.router;
```

* __song:__ 

- __getSong:__ Permite obtener todas las canciones que se encuentras en la base de datos, tienes la opcion de a traves de una query indicar el artibuto name, y entonces te devolvera solo aquella cancion con ese nombre; en caso de no encontrar nada, devuelve un mensage con la informacion correspondiente.

```ts
getSong = (req: Request, res: Response) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  Song.find(filter)
    .then(async (result) => {
      if (result.length > 0) res.status(200).json(result);
      else res.status(404).json({ message: "Song/s not Found" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```

__postSong:__ Permite añadir una nueva cancion a la coleccion de canciones, es necesario pasarle los datos correctos en el cuerpo de la peticion. Al guardar la nueva cancion, responde el objeto guardado.

```ts
postSong = (req: Request, res: Response) => {
  const newSong = new Song({
    name: req.body.name,
    author: req.body.author,
    duration: req.body.duration,
    genres: req.body.genres,
    single: req.body.single,
    reproductions: req.body.reproductions,
  })

  newSong
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```

__putSong:__ Actualiza una cancion, para saber que cancion actualizar es necesario indicar el nombre, que la identifica, y a demas pasar en el cuerpo de la peticion, los datos que se quieran actualizar. En caso de no encontrar el objeto responde con un mensage, informando al usuario.

```ts
putSong = (req: Request, res: Response) => {
  Song.findOneAndUpdate({name: req.query.name}, req.body, {
    new: true,
  })
    .then((result) => {
      if (result) res.status(200).json(result);
      else res.status(404).json({ message: "Song not Found" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```

__deleteSong:__ Dado un parameto _\_id_, elimina la cancion, respondiendole al usuario cual fue el objeto borrado, para si en caso de equivocacion, el ususario quiera volver a crearlo.

```ts
deleteSong = (req: Request, res: Response) => {
  Song.findOneAndDelete({name: req.query.name})
    .then((result) => {
      if (result) res.status(200).json(result)
      else res.status(404).json({ message: "Song not Found" })
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
```
---

### 4 Tests.

Se realizaron test con el uso de las herramientas de mocha, chai y chaiHttp. estos tests no generan un cubrimiento con Coveralls, por esto no se incluye Coveralls en el proyecto.

Aqui unos ejemplos de los tests realizados:

```ts
import { chai_, expect, url } from "./0-initVar.spec";

describe("Song API Tests", () => {
  it("POST Song", (done) => {
    chai_
      .request(url)
      .post("/song")
      .send({
        name: "Song Test 1",
        author: "Author Test 1",
        duration: 250,
        genres: ["pop", "jazz"],
        single: true,
        reproductions: 15482,
      })
      .end((_: any, res: any) => {
        expect(res).to.have.status(201);
        expect(res.body.name).to.eql('Song Test 1')
        expect(res.body.author).to.eql('Author Test 1')
        expect(res.body.duration).to.eql('00:03:10')
        expect(res.body.genres).to.eql(["pop", "jazz"])
        expect(res.body.single).to.eql(true)
        expect(res.body.reproductions).to.eql(15482)
        done();
      });
  });

  it("GET Songs", (done) => {
    chai_
      .request(url)
      .get("/song")
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql('Song Test 1')
        expect(res.body[0].author).to.eql('Author Test 1')
        expect(res.body[0].duration).to.eql('00:03:10')
        expect(res.body[0].genres).to.eql(["pop", "jazz"])
        expect(res.body[0].single).to.eql(true)
        expect(res.body[0].reproductions).to.eql(15482)
        done();
      });
  });

  it("PUT Song", (done) => {
    chai_
      .request(url)
      .put("/song")
      .query({ name: "Song Test 1" })
      .send({
        reproductions: 514454,
      })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('Song Test 1')
        expect(res.body.author).to.eql('Author Test 1')
        expect(res.body.duration).to.eql('00:03:10')
        expect(res.body.genres).to.eql(["pop", "jazz"])
        expect(res.body.single).to.eql(true)
        expect(res.body.reproductions).to.eql(514454)
        done();
      });
  });

  it("DELETE Song", (done) => {
    chai_
      .request(url)
      .delete("/song")
      .query({ name: "Song Test 1" })
      .end((_: any, res: any) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('Song Test 1')
        expect(res.body.author).to.eql('Author Test 1')
        expect(res.body.duration).to.eql('00:03:10')
        expect(res.body.genres).to.eql(["pop", "jazz"])
        expect(res.body.single).to.eql(true)
        expect(res.body.reproductions).to.eql(514454)
        done();
      });
  });
});
```

Para el ejecucion sincrona de todos los tests, se han usado los parametros de mocha, con _-S_ hacemos un sort de los ficheros por nombre, y con el _-p false_ desactivamos la ejecucion en paralelo, para que asi se ejecuten todos los test en secunecial.
