const pool = require('../config/db');

// ============================================
// MODELO DE LOTES - CONSULTAS SQL
// ============================================

const LoteModel = {
    // Obtener todos los lotes
    getAll: async () => {
        const query = `
            SELECT 
                l.id_lote,
                l.id_productor,
                l.id_producto,
                p.nombre AS nombre_producto,
                p.categoria,
                l.nombre_lote,
                l.superficie,
                l.fecha_siembra,
                l.fecha_cosecha_est,
                l.rendimiento_estimado,
                l.precio_venta_est,
                l.foto_siembra_url,
                l.foto_cosecha_url,
                l.ubicacion,
                l.variedad,
                l.estado,
                l.created_at
            FROM lote l
            INNER JOIN producto p ON l.id_producto = p.id_producto
            ORDER BY l.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    // Obtener un lote por ID
    getById: async (id) => {
        const query = `
            SELECT 
                l.id_lote,
                l.id_productor,
                l.id_producto,
                p.nombre AS nombre_producto,
                p.categoria,
                l.nombre_lote,
                l.superficie,
                l.fecha_siembra,
                l.fecha_cosecha_est,
                l.rendimiento_estimado,
                l.precio_venta_est,
                l.foto_siembra_url,
                l.foto_cosecha_url,
                l.ubicacion,
                l.variedad,
                l.estado,
                l.created_at
            FROM lote l
            INNER JOIN producto p ON l.id_producto = p.id_producto
            WHERE l.id_lote = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Crear un nuevo lote
    create: async (loteData) => {
        const {
            id_productor,
            id_producto,
            nombre_lote,
            superficie,
            fecha_siembra,
            fecha_cosecha_est,
            rendimiento_estimado,
            precio_venta_est,
            foto_siembra_url,
            ubicacion,
            variedad
        } = loteData;

        const query = `
            INSERT INTO lote (
                id_productor,
                id_producto,
                nombre_lote,
                superficie,
                fecha_siembra,
                fecha_cosecha_est,
                rendimiento_estimado,
                precio_venta_est,
                foto_siembra_url,
                ubicacion,
                variedad
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

        const values = [
            id_productor,
            id_producto,
            nombre_lote,
            superficie,
            fecha_siembra,
            fecha_cosecha_est,
            rendimiento_estimado,
            precio_venta_est,
            foto_siembra_url || null,
            ubicacion || null,
            variedad || null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Actualizar un lote
    update: async (id, loteData) => {
        const {
            nombre_lote,
            superficie,
            fecha_siembra,
            fecha_cosecha_est,
            rendimiento_estimado,
            precio_venta_est,
            estado
        } = loteData;

        const query = `
            UPDATE lote 
            SET 
                nombre_lote = $1,
                superficie = $2,
                fecha_siembra = $3,
                fecha_cosecha_est = $4,
                rendimiento_estimado = $5,
                precio_venta_est = $6,
                estado = $7
            WHERE id_lote = $8
            RETURNING *
        `;

        const values = [
            nombre_lote,
            superficie,
            fecha_siembra,
            fecha_cosecha_est,
            rendimiento_estimado,
            precio_venta_est,
            estado,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar un lote
    delete: async (id) => {
        const query = 'DELETE FROM lote WHERE id_lote = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener lotes por productor
    getByProductor: async (idProductor) => {
        const query = `
            SELECT 
                l.id_lote,
                l.id_productor,
                l.id_producto,
                p.nombre AS nombre_producto,
                p.categoria,
                l.nombre_lote,
                l.superficie,
                l.fecha_siembra,
                l.fecha_cosecha_est,
                l.rendimiento_estimado,
                l.precio_venta_est,
                l.estado,
                l.created_at
            FROM lote l
            INNER JOIN producto p ON l.id_producto = p.id_producto
            WHERE l.id_productor = $1
            ORDER BY l.created_at DESC
        `;
        const result = await pool.query(query, [idProductor]);
        return result.rows;
    }
};

module.exports = LoteModel;
