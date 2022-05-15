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

#### 1.3.2 Implementación del Server (Express).



---

#### 1.3.3 Implementación de la base de datos (mongoose).
##### 1.3.3.1 .env

##### 1.3.3.2 modelos

---
#### 1.3.4 Operaciones CRUD.