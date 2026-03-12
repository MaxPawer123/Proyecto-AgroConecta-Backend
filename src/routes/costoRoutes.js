const express = require('express');
const router = express.Router();
const CostoController = require('../controllers/costoController');

// ============================================
// RUTAS DE GASTOS - ENDPOINTS REST
// ============================================
// NOTA: Las rutas más específicas deben ir ANTES de las rutas con parámetros dinámicos

// GET /api/gastos/lote/:idLote - Obtener gastos de un lote específico
router.get('/lote/:idLote', CostoController.getGastosByLote);

// GET /api/gastos/lote/:idLote/resumen - Obtener resumen de costos del lote
router.get('/lote/:idLote/resumen', CostoController.getResumenCostos);

// GET /api/gastos/lote/:idLote/categoria - Obtener gastos agrupados por categoría
router.get('/lote/:idLote/categoria', CostoController.getGastosPorCategoria);

// GET /api/gastos - Obtener todos los gastos
router.get('/', CostoController.getAllGastos);

// GET /api/gastos/:id - Obtener un gasto por ID
router.get('/:id', CostoController.getGastoById);

// POST /api/gastos - Crear un nuevo gasto
router.post('/', CostoController.createGasto);

// PUT /api/gastos/:id - Actualizar un gasto
router.put('/:id', CostoController.updateGasto);

// DELETE /api/gastos/:id - Eliminar un gasto
router.delete('/:id', CostoController.deleteGasto);

module.exports = router;
