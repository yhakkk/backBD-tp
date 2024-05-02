const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT4 = process.env.PORT;




app.listen(PORT, () => {
    console.log(`Servidor de suma corriendo en http://localhost:${PORT4}`);
  });


