const express = require('express');
require('dotenv').config();
const axios = require("axios")
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());



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

app.listen(PORT, () => {
    console.log(`Servidor de suma corriendo en http://localhost:${PORT}`);
  });


