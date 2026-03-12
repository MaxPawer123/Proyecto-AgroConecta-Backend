const pool = require('../config/db');

// ============================================
// MODELO DE GASTOS - CONSULTAS SQL
// ============================================

const CostoModel = {
    // Obtener todos los gastos
    getAll: async () => {
        const query = `
            SELECT 
                g.id_gasto,
                g.id_lote,
                l.nombre_lote,
                g.categoria,
                g.descripcion,
                g.cantidad,
                g.costo_unitario,
                g.monto_total,
                g.tipo_costo,
                g.modalidad_pago,
                g.fecha_gasto
            FROM gasto_lote g
            INNER JOIN lote l ON g.id_lote = l.id_lote
            ORDER BY g.fecha_gasto DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    // Obtener un gasto por ID
    getById: async (id) => {
        const query = `
            SELECT 
                g.id_gasto,
                g.id_lote,
                l.nombre_lote,
                g.categoria,
                g.descripcion,
                g.cantidad,
                g.costo_unitario,
                g.monto_total,
                g.tipo_costo,
                g.modalidad_pago,
                g.fecha_gasto
            FROM gasto_lote g
            INNER JOIN lote l ON g.id_lote = l.id_lote
            WHERE g.id_gasto = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener gastos por lote
    getByLote: async (idLote) => {
        const query = `
            SELECT 
                id_gasto,
                id_lote,
                categoria,
                descripcion,
                cantidad,
                costo_unitario,
                monto_total,
                tipo_costo,
                modalidad_pago,
                fecha_gasto
            FROM gasto_lote
            WHERE id_lote = $1
            ORDER BY fecha_gasto DESC
        `;
        const result = await pool.query(query, [idLote]);
        return result.rows;
    },

    // Crear un nuevo gasto
    create: async (gastoData) => {
        const {
            id_lote,
            categoria,
            descripcion,
            cantidad,
            costo_unitario,
            tipo_costo,
            modalidad_pago
        } = gastoData;

        // Calcular el monto total automáticamente
        const monto_total = cantidad * costo_unitario;

        const query = `
            INSERT INTO gasto_lote (
                id_lote,
                categoria,
                descripcion,
                cantidad,
                costo_unitario,
                monto_total,
                tipo_costo,
                modalidad_pago
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const values = [
            id_lote,
            categoria,
            descripcion,
            cantidad,
            costo_unitario,
            monto_total,
            tipo_costo,
            modalidad_pago || 'NA'
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Actualizar un gasto
    update: async (id, gastoData) => {
        const {
            categoria,
            descripcion,
            cantidad,
            costo_unitario,
            tipo_costo,
            modalidad_pago
        } = gastoData;

        // Calcular el monto total automáticamente
        const monto_total = cantidad * costo_unitario;

        const query = `
            UPDATE gasto_lote 
            SET 
                categoria = $1,
                descripcion = $2,
                cantidad = $3,
                costo_unitario = $4,
                monto_total = $5,
                tipo_costo = $6,
                modalidad_pago = $7
            WHERE id_gasto = $8
            RETURNING *
        `;

        const values = [
            categoria,
            descripcion,
            cantidad,
            costo_unitario,
            monto_total,
            tipo_costo,
            modalidad_pago,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar un gasto
    delete: async (id) => {
        const query = 'DELETE FROM gasto_lote WHERE id_gasto = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener resumen de costos por lote (Para el Dashboard)
    getResumenByLote: async (idLote) => {
        const query = `
            SELECT 
                COUNT(*) as total_gastos,
                SUM(monto_total) as costo_total,
                SUM(CASE WHEN tipo_costo = 'FIJO' THEN monto_total ELSE 0 END) as costos_fijos,
                SUM(CASE WHEN tipo_costo = 'VARIABLE' THEN monto_total ELSE 0 END) as costos_variables
            FROM gasto_lote
            WHERE id_lote = $1
        `;
        const result = await pool.query(query, [idLote]);
        return result.rows[0];
    },

    // Obtener gastos por categoría (Para gráficos)
    getByCategoria: async (idLote) => {
        const query = `
            SELECT 
                categoria,
                COUNT(*) as cantidad_gastos,
                SUM(monto_total) as total_categoria
            FROM gasto_lote
            WHERE id_lote = $1
            GROUP BY categoria
            ORDER BY total_categoria DESC
        `;
        const result = await pool.query(query, [idLote]);
        return result.rows;
    }
};

module.exports = CostoModel;
