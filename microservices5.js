const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT6 = process.env.PORT6;




app.listen(PORT6, () => {
    console.log(`Servidor de suma corriendo en http://localhost:${PORT6}`);
  });


