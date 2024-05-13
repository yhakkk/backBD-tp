const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT3 = process.env.PORT3;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  const client = await pool.connect();
  try {
    // Crear tabla de roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE
      )
    `);

    // Crear tabla de asignaciones entre usuarios y roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios_roles (
        usuario_id INT NOT NULL,
        rol_id INT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuario(id),
        FOREIGN KEY (rol_id) REFERENCES roles(id)
      )
    `);
  } catch (err) {
    console.error('Error creando las tablas', err);
  } finally {
    client.release();
  }
})();

// Crear un nuevo rol
app.post('/roles', async (req, res) => {
  const { nombre } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO roles (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear el rol', err);
    res.status(500).json({ error: 'Error al crear el rol' });
  }
});

// Asignar un rol a un usuario
app.post('/asignar_rol', async (req, res) => {
  const { usuario_id, rol_id } = req.body;
  try {
    const client = await pool.connect();
    const duplicado = await client.query(
      'SELECT * FROM usuarios_roles WHERE usuario_id = $1 AND rol_id = $2',[usuario_id,rol_id]
    );
    
    if(duplicado.rows.length > 0){
      res.status(400).json({message: 'El rol ya esta asignado.'})
      return;

    }


    const result = await client.query(
      'INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES ($1, $2) RETURNING *',
      [usuario_id, rol_id]
    );
    client.release();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al asignar el rol', err);
    res.status(500).json({ error: 'Error al asignar el rol' });
  }
});


// Endpoint para obtener los roles de un usuario
app.get('/usuario_roles', async (req, res) => {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT 
        u.usuario AS nombre_usuario,
        r.nombre AS nombre_rol
      FROM 
        usuarios_roles ur
      INNER JOIN 
        usuario u ON ur.usuario_id = u.id
      INNER JOIN 
        roles r ON ur.rol_id = r.id
    `);

    client.release();
    
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener datos de usuario_roles', err);
    res.status(500).json({ error: 'Error al obtener datos de usuario_roles' });
  }
});

app.listen(PORT3, () => {
  console.log(`Servidor microservices2.js corriendo en http://localhost:${PORT3}`);
});
