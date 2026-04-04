-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Sistema: AgroConecta
-- Fecha: 21 de enero de 2026
-- ============================================

-- NOTA: Ejecuta este script en PostgreSQL conectado a la base de datos 'db_agroconecta'

-- 1. CREACIÓN DE TABLAS MAESTRAS (CATÁLOGOS)

-- Tabla de Usuarios (Simplificada para el MVP)
-- 1. Tabla Principal: USUARIO (Para todos: Clientes, Productores, Administradores)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('productor', 'cliente', 'admin')),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
    correo VARCHAR(150) UNIQUE, -- Útil para clientes web
    telefono VARCHAR(20) UNIQUE NOT NULL, -- Útil para contactar a cualquier usuario
    contrasena VARCHAR(255), -- Hash de la contraseña (para clientes web)
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Secundaria: PRODUCTOR (Extensión exclusiva para usuarios con rol 'productor')
CREATE TABLE IF NOT EXISTS productor (
    id_productor SERIAL PRIMARY KEY,
    id_usuario INTEGER UNIQUE NOT NULL, -- El UNIQUE garantiza que sea una relación 1 a 1
    pin VARCHAR(255), -- Hash del PIN de 4 dígitos (para la app móvil)
    departamento VARCHAR(50) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    comunidad VARCHAR(150) NOT NULL,
    
    -- Llave foránea que conecta al productor con su cuenta de usuario
    CONSTRAINT fk_usuario
        FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id_usuario) 
        ON DELETE CASCADE -- Si borras al usuario, se borra su perfil de productor automáticamente
);

-- Índices para que el backend busque rapidísimo cuando se inicie sesión
CREATE INDEX idx_usuarios_correo ON usuario(correo);
CREATE INDEX idx_usuarios_telefono ON usuario(telefono);
CREATE INDEX idx_productores_usuario ON productor(id_usuario);



-- Tabla de Productos (Lo que se puede sembrar - Catálogo)
CREATE TABLE IF NOT EXISTS producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Ej: Quinua Real
    categoria VARCHAR(50) CHECK (categoria IN ('Grano', 'Tuberculo', 'Hortaliza', 'Forraje', 'Quinua', 'Hortalizas')),
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

CREATE TABLE produccion_lote (
    id_produccion SERIAL PRIMARY KEY,
     id_lote INT NOT NULL REFERENCES lote(id_lote),
    fecha_registro DATE NOT NULL,
    
    -- DECIMAL(10,2) significa: hasta 10 dígitos en total, con 2 decimales. 
    -- Ideal para kilos (ej. 1500.50) y dinero (ej. 350.00)
    cantidad_obtenida DECIMAL(10, 2) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    
    -- Control para tu arquitectura Offline-First
    estado_sincronizacion VARCHAR(20) DEFAULT 'SINCRONIZADO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================
-- 3. INSERCIÓN DE DATOS DE PRUEBA (SEEDERS)
-- ============================================


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
