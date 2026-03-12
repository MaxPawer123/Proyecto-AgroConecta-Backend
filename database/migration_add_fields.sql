-- ============================================
-- MIGRACIÓN: Agregar campos nuevos a tabla lote
-- Fecha: 28 de enero de 2026
-- Descripción: Agregar foto_siembra_url, foto_cosecha_url, ubicacion y variedad
-- ============================================

-- Verificar si las columnas ya existen antes de agregarlas

-- 1. Agregar foto_siembra_url (Opcional - Foto al inicio)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lote' AND column_name = 'foto_siembra_url'
    ) THEN
        ALTER TABLE lote ADD COLUMN foto_siembra_url VARCHAR(255);
        RAISE NOTICE 'Columna foto_siembra_url agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna foto_siembra_url ya existe';
    END IF;
END $$;

-- 2. Agregar foto_cosecha_url (Requerida al cerrar - Para vender)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lote' AND column_name = 'foto_cosecha_url'
    ) THEN
        ALTER TABLE lote ADD COLUMN foto_cosecha_url VARCHAR(255);
        RAISE NOTICE 'Columna foto_cosecha_url agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna foto_cosecha_url ya existe';
    END IF;
END $$;

-- 3. Agregar ubicacion (Opcional - Ubicación del lote)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lote' AND column_name = 'ubicacion'
    ) THEN
        ALTER TABLE lote ADD COLUMN ubicacion VARCHAR(200);
        RAISE NOTICE 'Columna ubicacion agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna ubicacion ya existe';
    END IF;
END $$;

-- 4. Agregar variedad (Opcional - Variedad de semilla)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lote' AND column_name = 'variedad'
    ) THEN
        ALTER TABLE lote ADD COLUMN variedad VARCHAR(100);
        RAISE NOTICE 'Columna variedad agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna variedad ya existe';
    END IF;
END $$;

-- 5. Agregar fecha_cierre_real (Para cuando realmente se cosechó)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lote' AND column_name = 'fecha_cierre_real'
    ) THEN
        ALTER TABLE lote ADD COLUMN fecha_cierre_real DATE;
        RAISE NOTICE 'Columna fecha_cierre_real agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna fecha_cierre_real ya existe';
    END IF;
END $$;

-- 6. Agregar rendimiento_real (Kg que realmente sacó)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lote' AND column_name = 'rendimiento_real'
    ) THEN
        ALTER TABLE lote ADD COLUMN rendimiento_real NUMERIC(10,2);
        RAISE NOTICE 'Columna rendimiento_real agregada exitosamente';
    ELSE
        RAISE NOTICE 'Columna rendimiento_real ya existe';
    END IF;
END $$;

-- 7. Modificar el CHECK constraint del estado para incluir VENDIDO
DO $$
BEGIN
    -- Eliminar el constraint existente si existe
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'lote' AND constraint_name = 'lote_estado_check'
    ) THEN
        ALTER TABLE lote DROP CONSTRAINT lote_estado_check;
        RAISE NOTICE 'Constraint lote_estado_check eliminado';
    END IF;
    
    -- Agregar el nuevo constraint con VENDIDO
    ALTER TABLE lote ADD CONSTRAINT lote_estado_check 
        CHECK (estado IN ('ACTIVO', 'COSECHADO', 'VENDIDO', 'CANCELADO'));
    RAISE NOTICE 'Nuevo constraint lote_estado_check agregado con estado VENDIDO';
END $$;

-- Verificar que los cambios se aplicaron correctamente
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'lote'
ORDER BY ordinal_position;
