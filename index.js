const express = require('express');
require('dotenv').config();
const axios = require("axios")
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());

app.use(cookieParser());

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
      const response = await axios.post(`http://localhost:6001/aisgnar_rol`, req.body);
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

// Login-AUTH-API

app.post('/login', async(req, res) => {
  try {
    const response = await axios.post('http://localhost:6006/login', req.body);
    const token = response.data.token; // Obtener el token de la respuesta
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true }); // Almacenar el token en una cookie con una duración de 1 hora
    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error al comunicarse con el microservicio.");
    res.status(500).json({error:"Error al loguearse."});
  }
});

// Endpoint para realizar la búsqueda en MercadoLibre
app.get('/mercadolibre', async (req, res) => {
  const busqueda = req.query.q;
  try {
    const token = req.cookies.token; // Obtener el token de la cookie
    console.log("Este es el token",token);
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


