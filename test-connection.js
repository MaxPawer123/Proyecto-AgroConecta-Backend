require('dotenv').config();
const pool = require('./src/config/db');

// Script de prueba de conexión a PostgreSQL

async function testConnection() {
    try {
        console.log('🔍 Probando conexión a PostgreSQL...\n');
        
        // 1. Probar conexión básica
        const client = await pool.connect();
        console.log('✅ Conexión exitosa a PostgreSQL');
        
        // 2. Obtener versión de PostgreSQL
        const versionResult = await client.query('SELECT version()');
        console.log('📌 Versión:', versionResult.rows[0].version.split(',')[0]);
        
        // 3. Verificar que existe la base de datos
        const dbResult = await client.query('SELECT current_database()');
        console.log('📁 Base de datos:', dbResult.rows[0].current_database);
        
        // 4. Listar tablas existentes
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        
        console.log('\n📋 Tablas encontradas:');
        if (tablesResult.rows.length === 0) {
            console.log('  ⚠️  No hay tablas. Ejecuta el script database/setup.sql');
        } else {
            tablesResult.rows.forEach(row => {
                console.log(`  ✓ ${row.table_name}`);
            });
        }
        
        // 5. Contar registros en tablas principales (si existen)
        try {
            const productosCount = await client.query('SELECT COUNT(*) FROM producto');
            const lotesCount = await client.query('SELECT COUNT(*) FROM lote');
            const gastosCount = await client.query('SELECT COUNT(*) FROM gasto_lote');
            
            console.log('\n📊 Registros en base de datos:');
            console.log(`  Productos: ${productosCount.rows[0].count}`);
            console.log(`  Lotes: ${lotesCount.rows[0].count}`);
            console.log(`  Gastos: ${gastosCount.rows[0].count}`);
        } catch (err) {
            console.log('\n⚠️  Las tablas aún no están creadas');
        }
        
        client.release();
        console.log('\n✅ ¡Todo está listo! Puedes iniciar el servidor con: npm start\n');
        
    } catch (error) {
        console.error('❌ Error al conectar a PostgreSQL:', error.message);
        console.log('\n💡 Posibles soluciones:');
        console.log('  1. Verifica que PostgreSQL esté corriendo');
        console.log('  2. Verifica las credenciales en el archivo .env');
        console.log('  3. Verifica que la base de datos "db_agroconecta" exista');
        console.log('  4. Verifica el puerto (por defecto 5432)\n');
    } finally {
        await pool.end();
    }
}

testConnection();
