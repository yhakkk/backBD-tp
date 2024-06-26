const express = require('express');
require('dotenv').config(); //Carga de variables de entorno
const { Pool } = require('pg'); //Módulo para interactuar con la base de datos
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
  }); //Crear una instancia del pool de conexiones a PostgreSQL

  
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
          habilitado int DEFAULT 1,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    } catch (err) {
      console.error('Error creando la tabla', err);
    } finally {
      client.release();
    }
  })(); //Función autoejecutable que crea la tabla de usuarios, en caso de que no exitas


//Endpoint para crear un usuario nuevo
  app.post('/usuario_nuevo', async (req, res) => {
    const { usuario, pass, nombre, apellido } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO usuario (usuario, pass, nombre, apellido) VALUES ($1, $2, $3, $4) RETURNING *',
            [usuario, pass, nombre, apellido]
        );
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al ejecutar la query', err);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});
//Endpoint para obtener todos los usuarios
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
  
  //Endpoint para obtener todos los usuarios habilitados
  app.get(`/all_users_habilitados`, async (req,res) =>{

    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM usuario WHERE habilitado = 1')  
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error('Error al ejecutar la query',error);
      res.status(500).json({error: 'Error al obtener los usuarios'});
    }

  });
//Endpoint para obtener todos los usuarios deshabilitados
  app.get(`/all_users_deshabilitados`, async (req,res) =>{

    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM usuario WHERE habilitado = 0')  
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error('Error al ejecutar la query',error);
      res.status(500).json({error: 'Error al obtener los usuarios'});
    }

  });
  



app.listen(PORT2, () => {
    console.log(`Servidor microservices1.js corriendo en http://localhost:${PORT2}`);
  });


