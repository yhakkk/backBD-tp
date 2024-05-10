const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT6 = process.env.PORT6;
 

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

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

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  //Lógica de user y pass
  if (username === 'tomas' && password === '1234') {
    const token = generateToken({ username });
    res.json({ token }); //Devuelve token con 1h. de validez
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});



app.listen(PORT6, () => {
    console.log(`Servidor de suma corriendo en http://localhost:${PORT6}`);
  });


