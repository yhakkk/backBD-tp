const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');
const cors = require("cors")
const app = express();
const PORT4 = process.env.PORT4; 

app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

app.patch('/habilitar_usuario/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const client = await pool.connect();
        const result = await client.query(
            'UPDATE usuario SET habilitado = 1 WHERE id = $1 RETURNING *',
            [userId]
        );
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al ejecutar la query', err);
        res.status(500).json({ error: 'Error al habilitar el usuario' });
    }
});

app.listen(PORT4, () => {
    console.log(`Servidor de habilitar usuario corriendo en http://localhost:${PORT4}`);
});

