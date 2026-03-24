const ProductoModel = require('../models/productoModel');

// ============================================
// CONTROLADOR DE PRODUCTOS - LÓGICA DE NEGOCIO
// ============================================

const ProductoController = {
    // Obtener todos los productos
    getAllProductos: async (req, res) => {
        try {
            const productos = await ProductoModel.getAll();
            res.status(200).json({
                success: true,
                data: productos,
                count: productos.length
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los productos',
                error: error.message
            });
        }
    },

    // Obtener un producto por ID
    getProductoById: async (req, res) => {
        try {
            const { id } = req.params;
            const producto = await ProductoModel.getById(id);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: producto
            });
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el producto',
                error: error.message
            });
        }
    },

    // Crear un nuevo producto
    createProducto: async (req, res) => {
        try {
            const { nombre, categoria } = req.body;

            // Validación básica
            if (!nombre || !categoria) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre y categoria son obligatorios'
                });
            }

            // Validar categoría
            const categoriasValidas = ['Quinua', 'Hortalizas', 'Grano', 'Tuberculo', 'Hortaliza', 'Forraje'];
            if (!categoriasValidas.includes(categoria)) {
                return res.status(400).json({
                    success: false,
                    message: `La categoría debe ser una de: ${categoriasValidas.join(', ')}`
                });
            }

            const nuevoProducto = await ProductoModel.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: nuevoProducto
            });
        } catch (error) {
            console.error('Error al crear el producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear el producto',
                error: error.message
            });
        }
    },

    // Actualizar un producto
    updateProducto: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar si el producto existe
            const productoExistente = await ProductoModel.getById(id);
            if (!productoExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            const productoActualizado = await ProductoModel.update(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: productoActualizado
            });
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el producto',
                error: error.message
            });
        }
    },

    // Eliminar un producto
    deleteProducto: async (req, res) => {
        try {
            const { id } = req.params;
            
            const productoEliminado = await ProductoModel.delete(id);

            if (!productoEliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Producto eliminado exitosamente',
                data: productoEliminado
            });
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            
            // Error de clave foránea (producto en uso)
            if (error.code === '23503') {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede eliminar el producto porque está siendo usado en lotes activos'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al eliminar el producto',
                error: error.message
            });
        }
    },

    // Obtener productos por categoría
    getProductosByCategoria: async (req, res) => {
        try {
            const { categoria } = req.params;
            const productos = await ProductoModel.getByCategoria(categoria);

            res.status(200).json({
                success: true,
                data: productos,
                count: productos.length
            });
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos por categoría',
                error: error.message
            });
        }
    },

    // Obtener productos con estadísticas
    getProductosConEstadisticas: async (req, res) => {
        try {
            const productos = await ProductoModel.getWithStats();
            
            res.status(200).json({
                success: true,
                data: productos,
                count: productos.length
            });
        } catch (error) {
            console.error('Error al obtener productos con estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos con estadísticas',
                error: error.message
            });
        }
    }
};

module.exports = ProductoController;
