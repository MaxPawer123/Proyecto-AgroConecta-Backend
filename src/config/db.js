const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : 10,
    idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT ? Number(process.env.DB_IDLE_TIMEOUT) : 30000,
    connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT ? Number(process.env.DB_CONNECTION_TIMEOUT) : 2000,
});

pool.on('connect', () => {
    console.log('Conectado exitosamente a la Base de Datos PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de base de datos', err);
    process.exit(-1);
});

module.exports = pool;