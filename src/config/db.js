const { Pool } = require('pg');
require('dotenv').config(); // Cargar variables de entorno del archivo .env

// Configuración de la conexión usando las variables de tu archivo .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Listener para confirmar que la conexión fue exitosa
pool.on('connect', () => {
    console.log('Conectado exitosamente a la Base de Datos PostgreSQL');
});

// Listener para capturar errores de conexión inesperados
pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de base de datos', err);
    process.exit(-1);
});

module.exports = pool;