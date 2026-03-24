const pool = require('../config/db');

// ============================================
// MODELO DE PRODUCTOS - CONSULTAS SQL
// ============================================

const ProductoModel = {
    // Obtener todos los productos
    getAll: async () => {
        const query = `
            SELECT 
                id_producto,
                nombre,
                categoria
            FROM producto
            ORDER BY nombre ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    },

    // Obtener un producto por ID
    getById: async (id) => {
        const query = `
            SELECT 
                id_producto,
                nombre,
                categoria
            FROM producto
            WHERE id_producto = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Crear un nuevo producto
    create: async (productoData) => {
        const {
            nombre,
            categoria
        } = productoData;

        const query = `
            INSERT INTO producto (
                nombre,
                categoria
            ) VALUES ($1, $2)
            RETURNING *
        `;

        const values = [
            nombre,
            categoria,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Actualizar un producto
    update: async (id, productoData) => {
        const {
            nombre,
            categoria
        } = productoData;

        const query = `
            UPDATE producto 
            SET 
                nombre = $1,
                categoria = $2
            WHERE id_producto = $3
            RETURNING *
        `;

        const values = [
            nombre,
            categoria,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Eliminar un producto
    delete: async (id) => {
        const query = 'DELETE FROM producto WHERE id_producto = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Obtener productos por categoría
    getByCategoria: async (categoria) => {
        const query = `
            SELECT 
                id_producto,
                nombre,
                categoria
            FROM producto
            WHERE LOWER(categoria) = LOWER($1)
            ORDER BY nombre ASC
        `;
        const result = await pool.query(query, [categoria]);
        return result.rows;
    },

    // Obtener productos con estadísticas de uso (cuántos lotes usan cada producto)
    getWithStats: async () => {
        const query = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.categoria,
                COUNT(l.id_lote) as total_lotes,
                SUM(l.superficie) as superficie_total
            FROM producto p
            LEFT JOIN lote l ON p.id_producto = l.id_producto
            GROUP BY p.id_producto, p.nombre, p.categoria
            ORDER BY total_lotes DESC, p.nombre ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = ProductoModel;
