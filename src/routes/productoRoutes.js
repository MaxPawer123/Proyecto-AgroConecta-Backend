const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productoController');


// GET /api/productos - Obtener todos los productos
router.get('/', ProductoController.getAllProductos);

// GET /api/productos/stats - Obtener productos con estadísticas de uso
router.get('/stats', ProductoController.getProductosConEstadisticas);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', ProductoController.getProductoById);

// POST /api/productos - Crear un nuevo producto
router.post('/', ProductoController.createProducto);

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', ProductoController.updateProducto);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', ProductoController.deleteProducto);

// GET /api/productos/categoria/:categoria - Obtener productos por categoría
router.get('/categoria/:categoria', ProductoController.getProductosByCategoria);

module.exports = router;
