-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Sistema: AgroConecta
-- Fecha: 21 de enero de 2026
-- ============================================

-- NOTA: Ejecuta este script en PostgreSQL conectado a la base de datos 'db_agroconecta'

-- 1. CREACIÓN DE TABLAS MAESTRAS (CATÁLOGOS)

-- Tabla de Usuarios (Simplificada para el MVP)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('ADMIN', 'PRODUCTOR', 'COMPRADOR')) DEFAULT 'PRODUCTOR',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productores (Extensión del usuario)
CREATE TABLE IF NOT EXISTS productor (
    id_productor SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    comunidad VARCHAR(100) NOT NULL, -- Ej: Milla Milla
    municipio VARCHAR(100) NOT NULL, -- Ej: Sica Sica
    telefono VARCHAR(20)
);

-- Tabla de Productos (Lo que se puede sembrar - Catálogo)
CREATE TABLE IF NOT EXISTS producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Ej: Quinua Real
    categoria VARCHAR(50) CHECK (categoria IN ('Grano', 'Tuberculo', 'Hortaliza', 'Forraje')),
    unidad_medida_base VARCHAR(20) DEFAULT 'Kg', -- Para facilitar cálculos
    imagen_url VARCHAR(255) -- Ruta de la foto genérica
);

-- 2. CREACIÓN DE TABLAS TRANSACCIONALES (EL CORAZÓN DEL SISTEMA)

-- Tabla de Lotes (Cada siembra específica)
CREATE TABLE IF NOT EXISTS lote (
    id_lote SERIAL PRIMARY KEY,
    id_productor INT NOT NULL REFERENCES productor(id_productor),
    id_producto INT NOT NULL REFERENCES producto(id_producto),
    nombre_lote VARCHAR(100) NOT NULL, -- Ej: "Campaña Quinua 2025"
    superficie NUMERIC(10,2) NOT NULL, -- En Hectáreas
    fecha_siembra DATE NOT NULL,
    fecha_cosecha_est DATE NOT NULL,
    
    -- DATOS PARA TUS TARJETAS DE KPI (Finanzas)
    rendimiento_estimado NUMERIC(10,2) NOT NULL, -- Cuántos Kg espera sacar
    precio_venta_est NUMERIC(10,2) NOT NULL, -- A cuánto espera vender el Kg
    
    estado VARCHAR(20) CHECK (estado IN ('ACTIVO', 'COSECHADO', 'CANCELADO')) DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Gastos (Para la Calculadora de Costos)
CREATE TABLE IF NOT EXISTS gasto_lote (
    id_gasto SERIAL PRIMARY KEY,
    id_lote INT NOT NULL REFERENCES lote(id_lote) ON DELETE CASCADE,
    
    categoria VARCHAR(50) NOT NULL, -- Semillas, Fertilizantes, Alquiler, Mano de Obra
    descripcion VARCHAR(200),
    
    -- DATOS FINANCIEROS
    cantidad NUMERIC(10,2) DEFAULT 1,
    costo_unitario NUMERIC(10,2) NOT NULL,
    monto_total NUMERIC(10,2) NOT NULL, -- Se calcula: cantidad * costo_unitario
    
    tipo_costo VARCHAR(20) CHECK (tipo_costo IN ('FIJO', 'VARIABLE')), -- Para el Punto de Equilibrio
    
    -- TU REQUERIMIENTO ESPECIAL DE ALQUILER
    modalidad_pago VARCHAR(20) CHECK (modalidad_pago IN ('CICLO', 'ANUAL', 'NA')) DEFAULT 'NA',
    
    fecha_gasto DATE DEFAULT CURRENT_DATE
);

-- ============================================
-- 3. INSERCIÓN DE DATOS DE PRUEBA (SEEDERS)
-- ============================================

-- Insertar un Usuario Productor
INSERT INTO usuario (nombre_completo, email, password_hash, rol) 
VALUES ('Juan Mamani', 'juan@agro.com', 'secreto123', 'PRODUCTOR')
ON CONFLICT (email) DO NOTHING;

-- Insertar el perfil del Productor (Vinculado al usuario 1)
INSERT INTO productor (id_usuario, comunidad, municipio, telefono)
VALUES (1, 'Milla Milla', 'Sica Sica', '77712345')
ON CONFLICT DO NOTHING;

-- Insertar Productos al Catálogo
INSERT INTO producto (nombre, categoria) VALUES 
('Quinua Real', 'Grano'),
('Papa Imilla', 'Tuberculo')
ON CONFLICT DO NOTHING;

-- Insertar un Lote de Prueba (Quinua)
INSERT INTO lote (id_productor, id_producto, nombre_lote, superficie, fecha_siembra, fecha_cosecha_est, rendimiento_estimado, precio_venta_est)
VALUES (1, 1, 'Lote Quinua Norte 2025', 2.5, '2025-10-01', '2026-03-15', 500.00, 12.50)
ON CONFLICT DO NOTHING;

-- Insertar Gastos al Lote 1 (Semilla y Alquiler)
INSERT INTO gasto_lote (id_lote, categoria, descripcion, cantidad, costo_unitario, monto_total, tipo_costo, modalidad_pago)
VALUES 
(1, 'Semillas', 'Semilla Certificada Quinua', 2, 150.00, 300.00, 'VARIABLE', 'NA'),
(1, 'Alquiler de Terreno', 'Alquiler Parcela Norte', 1, 500.00, 500.00, 'FIJO', 'CICLO')
ON CONFLICT DO NOTHING;

-- ============================================
-- CONSULTAS DE VERIFICACIÓN
-- ============================================

-- Ver todos los usuarios
-- SELECT * FROM usuario;

-- Ver todos los productores
-- SELECT * FROM productor;

-- Ver todos los productos
-- SELECT * FROM producto;

-- Ver todos los lotes con información del producto
-- SELECT l.*, p.nombre as nombre_producto 
-- FROM lote l 
-- INNER JOIN producto p ON l.id_producto = p.id_producto;

-- Ver todos los gastos de un lote
-- SELECT * FROM gasto_lote WHERE id_lote = 1;
