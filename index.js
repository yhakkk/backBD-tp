const express = require('express');
require('dotenv').config();
const axios = require("axios")
const cors = require("cors");
const app = express();

const PORT = process.env.PORT ;
app.use(express.json());
app.use(cors());

const { verifyToken } = require('./microservices5');

//Microservices1 - Usuario

app.post('/crear_usuario', async (req, res) => {
  try {
      const response = await axios.post(`http://localhost:6005/usuario_nuevo`, req.body);
      res.status(201).json(response.data); // Enviar la respuesta del microservicio al cliente
  } catch (error) {
      console.error('Error al comunicarse con el microservicio:', error.message);
      res.status(500).json({ error: 'Error al crear el usuario' }); // Manejo de errores
  }
});


app.get('/usuarios', async (req,res) =>{
    try {
      const response = await axios.get(`http://localhost:6005/all_users`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
        console.error('Error al comunicarse con el microservicio:', error);
        res.status(500).json({error: 'Error al mostrar los usuarios'})
    }
});
app.get('/usuarios_habilitados', async (req,res) =>{
    try {
      const response = await axios.get(`http://localhost:6005/all_users_habilitados`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
        console.error('Error al comunicarse con el microservicio:', error);
        res.status(500).json({error: 'Error al mostrar los usuarios'})
    }
});
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


app.post('/crear_rol', async (req,res) =>{
    try {
      const response = await axios.post(`http://localhost:6001/roles`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error al comunicarse con el microservicio:', error);
      res.status(500).json({error: "Error al subir el rol."})
    }
});

app.post('/asignar_rol', async (req,res) =>{

    try {
      const response = await axios.post(`http://localhost:6001/asignar_rol`, req.body);
      res.status(201).json(response.data);
    } catch (error) {
      console.error("Error al comunicarse con el microservicio");
      res.status(500).json({error:"Error al asignar el rol."})

    }
});


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
    console.log(`Servidor de suma corriendo en http://localhost:${PORT}`);
  });


