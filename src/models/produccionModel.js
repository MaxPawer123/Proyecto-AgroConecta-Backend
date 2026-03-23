const pool = require('../config/db');

// ============================================
// MODELO DE PRODUCCION - CONSULTAS SQL
// ============================================

const ProduccionModel = {
    create: async (produccionData) => {
        const {
            id_lote,
            fecha_registro,
            cantidad_obtenida,
            precio_venta,
            estado_sincronizacion,
        } = produccionData;

        const query = `
            INSERT INTO produccion_lote (
                id_lote,
                fecha_registro,
                cantidad_obtenida,
                precio_venta,
                estado_sincronizacion
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;

        const values = [
            id_lote,
            fecha_registro,
            cantidad_obtenida,
            precio_venta,
            estado_sincronizacion || 'SINCRONIZADO',
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getByLote: async (idLote) => {
        const query = `
            SELECT
                id_produccion,
                id_lote,
                fecha_registro,
                cantidad_obtenida,
                precio_venta,
                estado_sincronizacion,
                created_at
            FROM produccion_lote
            WHERE id_lote = $1
            ORDER BY fecha_registro DESC, id_produccion DESC
        `;
        const result = await pool.query(query, [idLote]);
        return result.rows;
    },

    getLatestByLote: async (idLote) => {
        const query = `
            SELECT
                id_produccion,
                id_lote,
                fecha_registro,
                cantidad_obtenida,
                precio_venta,
                estado_sincronizacion,
                created_at
            FROM produccion_lote
            WHERE id_lote = $1
            ORDER BY fecha_registro DESC, id_produccion DESC
            LIMIT 1
        `;
        const result = await pool.query(query, [idLote]);
        return result.rows[0];
    },

    createAndSyncLote: async (produccionData) => {
        const {
            id_lote,
            fecha_registro,
            cantidad_obtenida,
            precio_venta,
            estado_sincronizacion,
        } = produccionData;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertProduccionQuery = `
                INSERT INTO produccion_lote (
                    id_lote,
                    fecha_registro,
                    cantidad_obtenida,
                    precio_venta,
                    estado_sincronizacion
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;

            const insertValues = [
                id_lote,
                fecha_registro,
                cantidad_obtenida,
                precio_venta,
                estado_sincronizacion || 'SINCRONIZADO',
            ];

            const produccionResult = await client.query(insertProduccionQuery, insertValues);

            const updateLoteQuery = `
                UPDATE lote
                SET
                    rendimiento_estimado = $1,
                    precio_venta_est = $2
                WHERE id_lote = $3
                RETURNING *
            `;

            const loteResult = await client.query(updateLoteQuery, [
                cantidad_obtenida,
                precio_venta,
                id_lote,
            ]);

            await client.query('COMMIT');

            return {
                produccion: produccionResult.rows[0],
                lote: loteResult.rows[0],
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};

module.exports = ProduccionModel;
