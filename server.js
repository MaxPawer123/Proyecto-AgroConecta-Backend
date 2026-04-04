require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');
const initializeDatabase = require('./src/config/initDb');
const os = require('os');

// Puerto del servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

function obtenerIpLan() {
    // Allow explicit override from environment (useful in CI or manual selection)
    const override = process.env.EXPOSE_IP;
    if (override && typeof override === 'string' && override.trim().length > 0) {
        return override.trim();
    }

    const interfaces = os.networkInterfaces();
    const candidatas = [];

    const virtualKeywords = ['vmware', 'vmnet', 'virtualbox', 'vbox', 'hyper-v', 'vethernet', 'virtual', 'tunnel', 'loopback', 'hamachi'];
    const esAliasVirtual = (alias) => {
        const valor = (alias || '').toLowerCase();
        return virtualKeywords.some(k => valor.includes(k));
    };

    const prioridadAlias = (alias, ip) => {
        const valor = (alias || '').toLowerCase();
        if (valor.includes('wi-fi') || valor.includes('wifi') || valor.includes('wlan') || valor.includes('wireless')) return 0;
        if (valor.includes('ethernet')) return 1;
        // Prefer common private IP ranges (likely LAN)
        if (ip && (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.'))) return 1;
        return 2;
    };

    for (const [alias, valores] of Object.entries(interfaces)) {
        if (esAliasVirtual(alias)) continue;
        for (const iface of valores || []) {
            if (iface.family !== 'IPv4' || iface.internal) continue;
            candidatas.push({ alias, ip: iface.address, prioridad: prioridadAlias(alias, iface.address) });
        }
    }

    // Debug: si no se encuentra la IP esperada, loguear candidatas para diagnóstico
    if (candidatas.length === 0) {
        // intentar devolver la primera no-interna si existe
        for (const valores of Object.values(interfaces)) {
            for (const iface of valores || []) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
        return '127.0.0.1';
    }

    // Ordenar por prioridad y por coincidencia con rangos privados
    candidatas.sort((a, b) => {
        if (a.prioridad !== b.prioridad) return a.prioridad - b.prioridad;
        const aPriv = (a.ip.startsWith('192.168.') || a.ip.startsWith('10.') || a.ip.startsWith('172.')) ? 0 : 1;
        const bPriv = (b.ip.startsWith('192.168.') || b.ip.startsWith('10.') || b.ip.startsWith('172.')) ? 0 : 1;
        return aPriv - bPriv;
    });

    // Mostrar candidatas en consola para ayudar al diagnóstico cuando la IP no sea la esperada
    try {
        console.log('🔎 Interfaces detectadas (candidatas):', candidatas.map(c => `${c.alias}:${c.ip}`));
    } catch (e) {
        // no bloquear por logging
    }

    return candidatas[0].ip;
}


async function startServer() {
    try {
        await initializeDatabase();
        console.log('Esquema de base de datos verificado/inicializado');

        app.listen(PORT, HOST, () => {
            const ipLan = obtenerIpLan();
            console.log(` Servidor activo en el puerto ${PORT}`);
            console.log(` http://localhost:${PORT}`);
            console.log(` LAN móvil: http://${ipLan}:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo inicializar la base de datos:', error.message);
        process.exit(1);
    }
}

// Iniciar el servidor
startServer();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...');
    pool.end(() => {
        console.log('Pool de conexiones cerrado');
        process.exit(0);
    });
}); 
