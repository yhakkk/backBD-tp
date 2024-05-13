const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { Pool } = require("pg");
const app = express();
const PORT6 = process.env.PORT6;
 
app.use(express.json());

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:{
      rejectUnauthorized:false

  }
});

// Verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

//Genera Token
const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

app.post('/login', async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
 
   try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM usuario WHERE usuario = $1 AND pass = $2 AND habilitado = 1', [username, password]);
    client.release();

    if (result.rows.length === 0) {
      // Si el usuario no existe o las credenciales son incorrectas, responde con un error 401
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];

    // Si las credenciales son correctas, genera un token y responde con él
    const token = jwt.sign({ username: user.usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error al realizar la consulta a la base de datos', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
//Endpoint de mercado libre. Realiza una verificación del token y luego consulta a la API de ML
app.get('/mercadolibre', verifyToken, async (req, res) => {
  const busqueda = req.query.q;
  try {
    const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${busqueda}`);
    res.status(200).json(response.data);
    
  } catch (error) {
    console.error('Error al comunicarse con la API de ML:', error);
    res.status(500).json({ error: 'Error al mostrar los datos' });
  }
});


if (require.main === module) {
  app.listen(PORT6, () => {
    console.log(`Servidor microservices5.js corriendo en http://localhost:${PORT6}`);
  });
}

module.exports = {
  verifyToken,
  generateToken
};

