const express = require('express');
require('dotenv').config();// Cargar variables de entorno desde el archivo .env
const axios = require("axios") //Axios, para realizar solicitudes HTTP
const cors = require("cors");//Middleware para habilitar CORS
const app = express();//Instancia de Express

const PORT = process.env.PORT ; // Puerto de ejecución, obtenido desde las variables de entorno (archivo .env)
app.use(express.json()); //Middleware para analizar el cuerpo de las solcitudes como jSON
app.use(cors()); //Habilitar CORS

const { verifyToken } = require('./microservices5'); // Importar la función verifyToken desde el microservicio5

//Microservices1 - Usuario

//Endpoint para crear un usuario nuevo
app.post('/crear_usuario', async (req, res) => {
  try {
      const response = await axios.post(`http://localhost:6005/usuario_nuevo`, req.body);
      res.status(201).json(response.data); // Enviar la respuesta del microservicio al cliente
  } catch (error) {
      console.error('Error al comunicarse con el microservicio:', error.message);
      res.status(500).json({ error: 'Error al crear el usuario' }); // Manejo de errores
  }
});

//Endpoint para obtener todos los usuarios
app.get('/usuarios', async (req,res) =>{
    try {
      const response = await axios.get(`http://localhost:6005/all_users`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
        console.error('Error al comunicarse con el microservicio:', error);
        res.status(500).json({error: 'Error al mostrar los usuarios'})
    }
});
//Endpoint para obtener usuarios habilitados
app.get('/usuarios_habilitados', async (req,res) =>{
    try {
      const response = await axios.get(`http://localhost:6005/all_users_habilitados`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
        console.error('Error al comunicarse con el microservicio:', error);
        res.status(500).json({error: 'Error al mostrar los usuarios'})
    }
});
//Endpoint para obtener usuarios deshabilitados
app.get('/usuarios_deshabilitados', async (req,res) =>{
    try {
      const response = await axios.get(`http://localhost:6005/all_users_deshabilitados`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
        console.error('Error al comunicarse con el microservicio:', error);
        res.status(500).json({error: 'Error al mostrar los usuarios'})
    }
});

//Habilitar/Deshabilitar Usuario

app.patch('/habilitar_usuario/:id', async (req,res) =>{
  const userId = req.params.id;
  try {
    const response = await axios.patch(`http://localhost:6002/habilitar_usuario/${userId}`,req.body)
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error al comunicarse con el microservicio:', error);
    res.status(500).json({error: 'Error al habilitar el usuario.'})
  }

});

app.patch('/deshabilitar_usuario/:id', async (req,res) =>{
  const userId = req.params.id;
  try {
    const response = await axios.patch(`http://localhost:6003/deshabilitar_usuario/${userId}`,req.body)
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error al comunicarse con el microservicio:', error);
    res.status(500).json({error: 'Error al habilitar el usuario.'})
  }

});


//Roles

//Endpoint para crear rol
app.post('/crear_rol', async (req,res) =>{
    try {
      const response = await axios.post(`http://localhost:6001/roles`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error al comunicarse con el microservicio:', error);
      res.status(500).json({error: "Error al subir el rol."})
    }
});
//Endpoint para asignar rol
app.post('/asignar_rol', async (req,res) =>{

    try {
      const response = await axios.post(`http://localhost:6001/asignar_rol`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
      console.error("Error al comunicarse con el microservicio");
      res.status(500).json({error:"Error al asignar el rol."})

    }
});

//Endpoint para obtener los roles de un usuario
app.get('/rol_usuario', async (req,res) => {
    try {
      const response = await axios.get('http://localhost:6001/usuario_roles');
      res.status(201).json(response.data);
    } catch (error) {
      console.error("Error al comunicarse con el microservicio.");
      res.status(500).json({error:"Error al mostrar el usuario."});
      
    }
});

//Login-AUTH-API
//Endpoint para obtener un token JWT e iniciar sesión 
app.post('/login', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:6006/login', req.body);
    //const token = response.data.token;
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error al comunicarse con el microservicio.");
    res.status(500).json({ error: "Error al loguearse." });
  }
});

// Endpoint para realizar la búsqueda en MercadoLibre
app.get('/mercadolibre', verifyToken, async (req, res) => {
  const busqueda = req.query.q;
  try {
    const token = req.headers.authorization.split(' ')[1]; // Obtener el token del encabezado de autorización
    const response = await axios.get(`http://localhost:6006/mercadolibre?q=${busqueda}`, { headers: { Authorization: `Bearer ${token}` } });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error al comunicarse con el microservicio.", error);
    res.status(500).json({ error: "Error con la búsqueda." });
  }
});

app.listen(PORT, () => {
    console.log(`Servidor index.js corriendo en http://localhost:${PORT}`);
  });


