const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');
const cors = require("cors")
const app = express();
const PORT2 = process.env.PORT2;


app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  
(async () => {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS usuario (
          id SERIAL PRIMARY KEY,
          usuario varchar(15) NOT NULL,
          pass varchar(15) NOT NULL,
          nombre varchar(50) NOT NULL,
          apellido varchar(50),
          habilitado int,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    } catch (err) {
      console.error('Error creando la tabla', err);
    } finally {
      client.release();
    }
  })();


  app.post('/usuario_nuevo', async (req, res) => {
    const { usuario, pass, nombre, apellido } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO usuario (usuario, pass, nombre, apellido,habilitado) VALUES ($1, $2, $3, $4,1) RETURNING *',
            [usuario, pass, nombre, apellido]
        );
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al ejecutar la query', err);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

  app.get('/all_users', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM usuario');
      client.release();
      res.json(result.rows);
    } catch (err) {
      console.error('Error al ejecutar la query', err);
      res.status(500).json({ error: 'Error al obtener los registros' });
    }
  });
  
  app.get(`/all_users/:id`, async (req,res) =>{
    


  });
  




app.listen(PORT2, () => {
    console.log(`Servidor de suma corriendo en http://localhost:${PORT2}`);
  });


