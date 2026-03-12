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
                categoria,
                unidad_medida_base,
                imagen_url
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
                categoria,
                unidad_medida_base,
                imagen_url
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
            categoria,
            unidad_medida_base,
            imagen_url
        } = productoData;

        const query = `
            INSERT INTO producto (
                nombre,
                categoria,
                unidad_medida_base,
                imagen_url
            ) VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [
            nombre,
            categoria,
            unidad_medida_base || 'Kg',
            imagen_url || null
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Actualizar un producto
    update: async (id, productoData) => {
        const {
            nombre,
            categoria,
            unidad_medida_base,
            imagen_url
        } = productoData;

        const query = `
            UPDATE producto 
            SET 
                nombre = $1,
                categoria = $2,
                unidad_medida_base = $3,
                imagen_url = $4
            WHERE id_producto = $5
            RETURNING *
        `;

        const values = [
            nombre,
            categoria,
            unidad_medida_base,
            imagen_url,
            id
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
                categoria,
                unidad_medida_base,
                imagen_url
            FROM producto
            WHERE categoria = $1
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
                p.unidad_medida_base,
                COUNT(l.id_lote) as total_lotes,
                SUM(l.superficie) as superficie_total
            FROM producto p
            LEFT JOIN lote l ON p.id_producto = l.id_producto
            GROUP BY p.id_producto, p.nombre, p.categoria, p.unidad_medida_base
            ORDER BY total_lotes DESC, p.nombre ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    }
};

module.exports = ProductoModel;
