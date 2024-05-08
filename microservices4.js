const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT5 = process.env.PORT5;




app.listen(PORT5, () => {
    console.log(`Servidor de suma corriendo en http://localhost:${PORT5}`);
  });


