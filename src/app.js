const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const loteRoutes = require('./routes/loteRoutes');
const costoRoutes = require('./routes/costoRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

// CORS - Permitir peticiones del frontend
app.use(cors());

// Parser de JSON
app.use(express.json());

// Parser de URL-encoded
app.use(express.urlencoded({ extended: true }));


// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API de AgroConecta',
        version: '1.0.0',
        endpoints: {
            lotes: '/api/lotes',
            gastos: '/api/gastos',
            productos: '/api/productos'
        }
    });
});

// Registrar las rutas de la API
app.use('/api/lotes', loteRoutes);
app.use('/api/gastos', costoRoutes);
app.use('/api/productos', productoRoutes);



app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

module.exports = app;
