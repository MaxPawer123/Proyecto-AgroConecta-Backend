const express = require('express');
const router = express.Router();
const ProduccionController = require('../controllers/produccionController');

// ============================================
// RUTAS DE PRODUCCION - ENDPOINTS REST
// ============================================

// GET /api/produccion/lote/:idLote - Obtener historial de produccion por lote
router.get('/lote/:idLote', ProduccionController.getProduccionByLote);

// GET /api/produccion/lote/:idLote/ultima - Obtener ultimo registro de produccion por lote
router.get('/lote/:idLote/ultima', ProduccionController.getUltimaProduccionByLote);

// POST /api/produccion - Registrar un nuevo dato de produccion
router.post('/', ProduccionController.createProduccion);

module.exports = router;
