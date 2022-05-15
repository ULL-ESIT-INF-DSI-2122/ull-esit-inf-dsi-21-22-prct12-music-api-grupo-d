# Informe Práctica 12
## API NODE / Express de gestión de información musical.

---

## Calidad y seguridad del código fuente mediante Sonar Cloud

<p align="center">
    <a href="">
        <img alt="Coveralls" src="">
    </a>
    <a href="">
        <img alt="Coveralls" src="">
    </a>
    <a href="">
        <img alt="Coveralls" src="">
    </a>
    <a href="">
        <img alt="Coveralls" src="">
    </a>
</p>

---

## Autores: 

Vlatko Jesús Marchán Sekulic | alu0101321141@ull.edu.es

Yeixon Morales Gonzalez | alu0101133324@ull.edu.es

Nicolas Vegas Rodriguez | alu0101321745@ull.edu.es

Luciano Sekulic Gregoris | alu0101022239@ull.edu.es

---

## 0. Recomendaciones para el correcto funcionamiento del código.

* Ir al punto 1.3.3.1 Para utilizar correctamente el __Mongose Atlas__

---

## 1. Introducción de la práctica.

Se nos propone llevar a cabo una API de gestión de información musical. Para dicho desarrollo se utilizarán principalmente los paquetes _mongoose_ (Para la base de datos) y _express_ (Para la configuración del servidor de la API).

---

### 1.1 Organización del grupo.

Para el desarrollo de la práctica todos los integrantes del grupo se han encargado de diferentes tareas para la creación del programa, para ello se ha repartido de manera equitativa la documentación y el desarrollo del codigo.

![Consola](./assets/imagen1.png)

---

### 1.2 Método de desarollo.

Todos los integrantes del grupo nos hemos conectado mediante el uso de ssh a un servidor del compañero Yeixon Morales, por este motivo la mayoría de commits del desarrollo son realizados desde su cuenta github.

---

### 1.3 Planteamiento del trabajo.

#### 1.3.1 Relaciones entre las entidades.

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

#### 1.3.2 Implementación del Server (Express).

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

* __initApp:__ Función que inicializa toda la API estableciendo ciertas características y rutas. Lass características se definen en las primeras 4 líneas, _morgan_ permite ver las peticiones que recibe la API, _express.json()_ Analiza las solicitudes entrantes con cargas JSON, _express.urlencoded({ extended: false }_  Analiza las requests entrantes con cargas útiles codificadas en urlencoded y se basa en body-parser. _express.static(join(\_\_dirname, "../public")_ sirve los archivos estáticos. Por otro lado, en caso de que se inicie la aplicación en modo _test_ se le añadirá un __endpoint__ que permitirá reiniciar todo el contenido de la colección test en la base de datos. Y por ultimo se le dice a la API que utilice ciertas rutas (Que se mencionarán mas adelante en el punto 1.3.4)

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

* __connectMongoDB:__ Función encargada de conectarse a la base de datos de __MongoDB Atlas__ para ello usamos _mongoose_ con su función _connect_ a la que le pasaremos la URI de la base de datos y unas opciones, en concreto _autoIndex_ que genera un _\_id_ automáticamente. Con lo que respecta al process.env se explicará más delante en el informe, concretamente en el punto 1.3.3.1

```typescript
  connectMongoDB = () => {
    let MONGODB_URI: string = `mongodb+srv://admin:${process.env.PWDMONGO}@music-dsi.oqoxo.mongodb.net/Music-API?retryWrites=true&w=majority`;
    
    if (process.env.NODE_ENV === "test") {
      MONGODB_URI = `mongodb+srv://admin:${process.env.PWDMONGO}@music-dsi.oqoxo.mongodb.net/Music-API-Test?retryWrites=true&w=majority`;
    }    
    
    const options = {
      autoIndex: true,
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
    this.app.listen(this.port, () => {
      console.log("Server is running on port: " + this.port);
    });
  };
```


---

#### 1.3.3 Implementación de la base de datos (mongoose).
##### 1.3.3.1 .env

Por seguridad y no publicar la contraseña de la base de datos del __MongoDB Atlas__ en github se optó por crear el fichero _.env_ el cual contiene la contraseña de dicho servico.

Para que nos funcione deberemos crear el fichero _.env_ y poner el contenido de la siguiente manera:

```
PWDMONGO = "Aquí iría la contraseña"
```

Por otro lado, tal y como se pudo ver en el método de __connectMongoDB__ se utiliza _process.env.NODE\_ENV_ este permite ejecutar la API en diferentes modos, tal y como se puede observar en el __package.json__ 

```typescript
"server-test": "tsc && cross-env NODE_ENV=test node dist/index.js",
"server-dev": "tsc-watch --onSuccess \"cross-env NODE_ENV=dev node dist/index.js\"",
"server": "tsc && cross-env NODE_ENV=production node dist/index.js",
```

##### 1.3.3.2 modelos




---
#### 1.3.4 Operaciones CRUD.