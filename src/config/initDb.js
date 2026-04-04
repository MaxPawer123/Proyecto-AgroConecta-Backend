const bcrypt = require('bcryptjs');
const pool = require('./db');

async function initializeDatabase() {
    const demoPinHash = bcrypt.hashSync('1234', 10);

    const schemaSQL = `
        CREATE TABLE IF NOT EXISTS usuario (
            id_usuario SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            rol VARCHAR(20) NOT NULL CHECK (rol IN ('productor', 'cliente', 'admin')),
            estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
            correo VARCHAR(150) UNIQUE,
            telefono VARCHAR(20) UNIQUE NOT NULL,
            contrasena VARCHAR(255),
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS productor (
            id_productor SERIAL PRIMARY KEY,
            id_usuario INTEGER UNIQUE NOT NULL,
            pin VARCHAR(255),
            departamento VARCHAR(50) NOT NULL,
            municipio VARCHAR(100) NOT NULL,
            comunidad VARCHAR(150) NOT NULL,
            CONSTRAINT fk_productor_usuario
                FOREIGN KEY (id_usuario)
                REFERENCES usuario(id_usuario)
                ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuario(correo);
        CREATE INDEX IF NOT EXISTS idx_usuarios_telefono ON usuario(telefono);
        CREATE INDEX IF NOT EXISTS idx_productores_usuario ON productor(id_usuario);

        CREATE TABLE IF NOT EXISTS producto (
            id_producto SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            categoria VARCHAR(50) CHECK (categoria IN ('Grano', 'Tuberculo', 'Hortaliza', 'Forraje', 'Quinua', 'Hortalizas'))
        );

        CREATE TABLE IF NOT EXISTS lote (
            id_lote SERIAL PRIMARY KEY,
            id_productor INT NOT NULL REFERENCES productor(id_productor),
            id_producto INT NOT NULL REFERENCES producto(id_producto),
            nombre_lote VARCHAR(100) NOT NULL,
            superficie NUMERIC(10,2) NOT NULL,
            fecha_siembra DATE NOT NULL,
            fecha_cosecha_est DATE NOT NULL,
            rendimiento_estimado NUMERIC(10,2) NOT NULL,
            precio_venta_est NUMERIC(10,2) NOT NULL,
            foto_siembra_url VARCHAR(255),
            foto_cosecha_url VARCHAR(255),
            ubicacion VARCHAR(200),
            variedad VARCHAR(100),
            estado VARCHAR(20) CHECK (estado IN ('ACTIVO', 'COSECHADO', 'VENDIDO', 'CANCELADO')) DEFAULT 'ACTIVO',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS gasto_lote (
            id_gasto SERIAL PRIMARY KEY,
            id_lote INT NOT NULL REFERENCES lote(id_lote) ON DELETE CASCADE,
            categoria VARCHAR(50) NOT NULL,
            descripcion VARCHAR(200),
            cantidad NUMERIC(10,2) DEFAULT 1,
            costo_unitario NUMERIC(10,2) NOT NULL,
            monto_total NUMERIC(10,2) NOT NULL,
            tipo_costo VARCHAR(20) CHECK (tipo_costo IN ('FIJO', 'VARIABLE')),
            modalidad_pago VARCHAR(20) CHECK (modalidad_pago IN ('CICLO', 'ANUAL', 'NA')) DEFAULT 'NA',
            fecha_gasto DATE DEFAULT CURRENT_DATE
        );

        CREATE TABLE IF NOT EXISTS produccion_lote (
            id_produccion SERIAL PRIMARY KEY,
            id_lote INT NOT NULL REFERENCES lote(id_lote),
            fecha_registro DATE NOT NULL,
            cantidad_obtenida DECIMAL(10, 2) NOT NULL,
            precio_venta DECIMAL(10, 2) NOT NULL,
            estado_sincronizacion VARCHAR(20) DEFAULT 'SINCRONIZADO',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const seedBaseDataSQL = `
        INSERT INTO usuario (nombre, apellido, rol, telefono, estado)
        SELECT 'Demo', 'Productor', 'productor', '777000001', 'activo'
        WHERE NOT EXISTS (
            SELECT 1 FROM usuario WHERE telefono = '777000001'
        );

        INSERT INTO productor (id_usuario, pin, departamento, municipio, comunidad)
        SELECT u.id_usuario, '${demoPinHash}', 'Cochabamba', 'Sipe Sipe', 'Comunidad Demo'
        FROM usuario u
        WHERE u.telefono = '777000001'
        ON CONFLICT (id_usuario) DO UPDATE
        SET pin = EXCLUDED.pin,
            departamento = EXCLUDED.departamento,
            municipio = EXCLUDED.municipio,
            comunidad = EXCLUDED.comunidad;

        INSERT INTO producto (nombre, categoria)
        SELECT 'Quinua Real', 'Quinua'
        WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Quinua Real');

        INSERT INTO producto (nombre, categoria)
        SELECT 'Lechuga', 'Hortalizas'
        WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Lechuga');

        INSERT INTO producto (nombre, categoria)
        SELECT 'Zanahoria', 'Hortalizas'
        WHERE NOT EXISTS (SELECT 1 FROM producto WHERE nombre = 'Zanahoria');
    `;

    await pool.query(schemaSQL);
    await pool.query(seedBaseDataSQL);
}

module.exports = initializeDatabase;