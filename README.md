
## Crear ENV

Crear archivo .env y colocar los puertos

- PORT = Elegir Puerto
- PORT2 = Elegir Puerto
- PORT3 = Elegir Puerto
- PORT4 = Elegir Puerto
- PORT5 = Elegir Puerto
- PORT6 = Elegir Puerto
- JWT_SECRET= Elegir Palabra 
- DATABASE_URL= URL de Render
## Crear Base de Datos

Utilizar Render para hacer la conexion a la base de datos en la nube, utilizando la extension de Database Client (PostGre)

## ----------------------------------------------------------------------------------

# Trabajo práctico backend - Redes

El objetivo de este trabajo práctico es que los equipos desarrollen un backend utilizando Node.js y microservicios. Implementarán diferentes funcionalidades relacionadas con la gestión de usuarios, roles y autenticación JWT.

## Requisitos previos

- Node.js (v20.8.0 o superior)
- PostgreSQL (disponible en https://render.com/)
- Otras dependencias:
  - Express.js
  - Axios
  - cors
  - jsonwebtoken
  - dotenv
  - cookie-parser

## Instalación

1. Clonar el repositorio: `git clone https://github.com/yhakkk/backBD-tp`
2. Instalar las dependencias: `npm install`
3. Configurar las variables de entorno (ver sección de configuración)


## Configuración

1. Crear un archivo `.env` en la raíz del proyecto.
2. Definir las siguientes variables de entorno en el archivo `.env`:
   - `PORT`: Puerto en el que se ejecutará el servidor principal
   - `PORT2`, `PORT3`, `PORT4`, `PORT5`, `PORT6`: Puertos para los microservicios
   - `JWT_SECRET`: Clave secreta para firmar tokens JWT
   - `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL

## Estructura del proyecto

- `index.js`: Archivo principal que maneja las rutas y la comunicación con los microservicios.
- `microservices1.js`: Microservicio encargado de la gestión de usuarios (crear, obtener, etc).
- `microservices2.js`: Microservicio encargado de la gestión de roles (crear, asignar, obtener).
- `microservices3.js`: Microservicio encargado de habilitar usuarios.
- `microservices4.js`: Microservicio encargado de deshabilitar usuarios.
- `microservices5.js`: Microservicio encargado de la autenticación JWT y la búsqueda en MercadoLibre.
- `README.md`README.md: Archivo con la documentación del proyecto.
- `front/`: Directorio que contiene los archivos del frontend.

### `index.js`

El archivo index.js es el punto de entrada principal de la aplicación. Aquí se configuran los middlewares necesarios, se importan los módulos requeridos y se definen los endpoints para interactuar con los diferentes microservicios.

Se importan los módulos necesarios: express, dotenv, axios y cors.
Se carga el archivo .env con las variables de entorno utilizando dotenv.
Se crea una instancia de la aplicación Express y se habilitan los middlewares para analizar el cuerpo de las solicitudes como JSON y habilitar CORS.
Se importa la función verifyToken desde el microservicio5 para verificar los tokens JWT.
Se definen los endpoints para interactuar con los microservicios de usuarios, roles, autenticación y búsqueda en MercadoLibre.
Cada endpoint realiza una solicitud HTTP al microservicio correspondiente utilizando axios.
El endpoint /mercadolibre requiere autenticación JWT y utiliza la función verifyToken como middleware.
Finalmente, se inicia el servidor Express en el puerto especificado en las variables de entorno.
Este archivo actúa como un orquestador, manejando las solicitudes entrantes y delegándolas a los microservicios correspondientes. También se encarga de la autenticación JWT y la búsqueda en MercadoLibre.

## `microservices1.js`

microservices1.js es un microservicio encargado de la gestión de usuarios. Aquí se definen los endpoints para crear, obtener, habilitar y deshabilitar usuarios.

Se importan los módulos necesarios: express, dotenv, pg y cors.
Se carga el archivo .env con las variables de entorno utilizando dotenv.
Se crea una instancia de la aplicación Express y se habilitan los middlewares para analizar el cuerpo de las solicitudes como JSON y habilitar CORS.
Se crea una instancia del pool de conexiones a PostgreSQL utilizando la URL de la base de datos desde las variables de entorno.
Se define una función autoejecutable que crea la tabla de usuarios si no existe.
Se define el endpoint POST /usuario_nuevo para crear un nuevo usuario en la base de datos.
Se define el endpoint GET /all_users para obtener todos los usuarios de la base de datos.
Se define el endpoint GET /all_users_habilitados para obtener los usuarios habilitados de la base de datos.
Se define el endpoint GET /all_users_deshabilitados para obtener los usuarios deshabilitados de la base de datos.

## `microservices2.js`

microservices2.js es un microservicio encargado de la gestión de roles y la asignación de roles a usuarios.

Se importan los módulos necesarios: express, dotenv y pg.
Se carga el archivo .env con las variables de entorno utilizando dotenv.
Se crea una instancia de la aplicación Express y se habilita el middleware para analizar el cuerpo de las solicitudes como JSON.
Se crea una instancia del pool de conexiones a PostgreSQL utilizando la URL de la base de datos desde las variables de entorno.
Se define una función autoejecutable que crea las tablas de roles y usuarios_roles si no existen.
Se define el endpoint POST /roles para crear un nuevo rol en la base de datos.
Se define el endpoint POST /asignar_rol para asignar un rol a un usuario en la base de datos. Verifica si el rol ya está asignado al usuario antes de asignarlo.
Se define el endpoint GET /usuario_roles para obtener los roles asignados a cada usuario de la base de datos.

## `microservices3.js`

microservices3.js es un microservicio encargado de habilitar usuarios en la base de datos.

Se importan los módulos necesarios: express, dotenv, pg y cors.
Se carga el archivo .env con las variables de entorno.
Se crea una instancia de la aplicación Express y se habilitan los middlewares para analizar el cuerpo de las solicitudes como JSON y habilitar CORS.
Se crea una instancia del pool de conexiones a PostgreSQL.
Se define el endpoint PATCH /habilitar_usuario/:id para habilitar un usuario en la base de datos mediante su ID.
Se inicia el servidor Express en el puerto especificado en las variables de entorno.


## `microservices4.js`

El archivo microservices4.js es un microservicio encargado de deshabilitar usuarios en la base de datos. Su estructura y funcionamiento son similares al microservices3.js, pero en lugar de habilitar usuarios, define un endpoint PATCH /deshabilitar_usuario/:id para deshabilitar un usuario en la base de datos mediante su ID.


## `microservices5.js`


 microservices5.js es un microservicio encargado de la autenticación JWT y la búsqueda en MercadoLibre.

Se importan los módulos necesarios: express, axios, dotenv, pg y jsonwebtoken.
Se carga el archivo .env con las variables de entorno.
Se crea una instancia de la aplicación Express y se habilita el middleware para analizar el cuerpo de las solicitudes como JSON.
Se importa el módulo jsonwebtoken y se obtiene la clave secreta JWT desde las variables de entorno.
Se crea una instancia del pool de conexiones a PostgreSQL.
Se define una función verifyToken para verificar los tokens JWT en las solicitudes entrantes.
Se define una función generateToken para generar un nuevo token JWT.
Se define el endpoint POST /login para autenticar a un usuario y obtener un token JWT.
Se define el endpoint GET /mercadolibre para realizar una búsqueda en MercadoLibre. Este endpoint requiere autenticación JWT y utiliza la función verifyToken como middleware.
Se inicia el servidor Express en el puerto especificado en las variables de entorno.
Se exportan las funciones verifyToken y generateToken para ser utilizadas en otros archivos.
