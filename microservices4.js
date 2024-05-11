const express = require('express');
require('dotenv').config();
const { Pool } = require('pg');
const cors = require("cors")
const app = express();
const PORT5 = process.env.PORT5; 

app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});

app.patch('/deshabilitar_usuario/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const client = await pool.connect();
        const result = await client.query(
            'UPDATE usuario SET habilitado = 0 WHERE id = $1 RETURNING *',
            [userId]
        );
        client.release();
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error al ejecutar la query', err);
        res.status(500).json({ error: 'Error al deshabilitar el usuario' });
    }
});

app.listen(PORT5, () => {
    console.log(`Servidor de deshabilitar usuario corriendo en http://localhost:${PORT5}`);
});


