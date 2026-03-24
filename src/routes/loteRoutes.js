const express = require('express');
const router = express.Router();
const LoteController = require('../controllers/loteController');
const { uploadFotoSiembra } = require('../middleware/upload');

// ============================================
// RUTAS DE LOTES - ENDPOINTS REST
// ============================================

// GET /api/lotes - Obtener todos los lotes
router.get('/', LoteController.getAllLotes);

// GET /api/lotes/productor/:idProductor - Obtener lotes por productor
router.get('/productor/:idProductor', LoteController.getLotesByProductor);

// GET /api/lotes/producto/:idProducto - Obtener lotes por producto
router.get('/producto/:idProducto', LoteController.getLotesByProducto);

// GET /api/lotes/:id - Obtener un lote por ID
router.get('/:id', LoteController.getLoteById);

// POST /api/lotes - Crear un nuevo lote
router.post('/', LoteController.createLote);

// POST /api/lotes/upload/siembra - Subir foto de siembra y obtener URL publica
router.post('/upload/siembra', uploadFotoSiembra.single('foto'), LoteController.uploadSiembraPhoto);

// PUT /api/lotes/:id - Actualizar un lote
router.put('/:id', LoteController.updateLote);

// DELETE /api/lotes/:id - Eliminar un lote
router.delete('/:id', LoteController.deleteLote);

module.exports = router;
