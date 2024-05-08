const express = require('express');
require('dotenv').config();
const axios = require("axios")
const app = express();
const PORT = process.env.PORT;
app.use(express.json());


app.post('/crear_usuario', async (req, res) => {
  try {
      const response = await axios.post(`http://localhost:6005/usuario_nuevo`, req.body);
      res.status(201).json(response.data); // Enviar la respuesta del microservicio al cliente
  } catch (error) {
      console.error('Error al comunicarse con el microservicio:', error.message);
      res.status(500).json({ error: 'Error al crear el usuario' }); // Manejo de errores
  }
});

app.listen(PORT, () => {
    console.log(`Servidor de suma corriendo en http://localhost:${PORT}`);
  });


