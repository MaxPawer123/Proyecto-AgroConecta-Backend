require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

// Puerto del servidor
const PORT = process.env.PORT || 6500;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en el puerto ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...');
    pool.end(() => {
        console.log('Pool de conexiones cerrado');
        process.exit(0);
    });
}); 
