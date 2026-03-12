const CostoModel = require('../models/costoModel');


// CONTROLADOR DE COSTOS - LÓGICA DE NEGOCIO
const CostoController = {
    // Obtener todos los gastos
    getAllGastos: async (req, res) => {
        try {
            const gastos = await CostoModel.getAll();
            res.status(200).json({
                success: true,
                data: gastos,
                count: gastos.length
            });
        } catch (error) {
            
            console.error('Error al obtener gastos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los gastos',
                error: error.message
            });
        }
    },

    // Obtener un gasto por ID
    getGastoById: async (req, res) => {
        try {
            const { id } = req.params;
            const gasto = await CostoModel.getById(id);

            if (!gasto) {
                return res.status(404).json({
                    success: false,
                    message: 'Gasto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: gasto
            });
        } catch (error) {
            console.error('Error al obtener el gasto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el gasto',
                error: error.message
            });
        }
    },

    // Obtener gastos por lote
    getGastosByLote: async (req, res) => {
        try {
            const { idLote } = req.params;
            const gastos = await CostoModel.getByLote(idLote);

            res.status(200).json({
                success: true,
                data: gastos,
                count: gastos.length
            });
        } catch (error) {
            console.error('Error al obtener gastos del lote:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los gastos del lote',
                error: error.message
            });
        }
    },

    // Crear un nuevo gasto
    createGasto: async (req, res) => {
        try {
            const {
                id_lote,
                categoria,
                descripcion,
                cantidad,
                costo_unitario,
                tipo_costo,
                modalidad_pago
            } = req.body;

            // Validación básica
            if (!id_lote || !categoria || !cantidad || !costo_unitario || !tipo_costo) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos id_lote, categoria, cantidad, costo_unitario y tipo_costo son obligatorios'
                });
            }

            // Validar que cantidad y costo_unitario sean números positivos
            if (cantidad <= 0 || costo_unitario <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La cantidad y el costo unitario deben ser mayores a 0'
                });
            }

            const nuevoGasto = await CostoModel.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Gasto registrado exitosamente',
                data: nuevoGasto
            });
        } catch (error) {
            console.error('Error al crear el gasto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar el gasto',
                error: error.message
            });
        }
    },

    // Actualizar un gasto
    updateGasto: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar si el gasto existe
            const gastoExistente = await CostoModel.getById(id);
            if (!gastoExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Gasto no encontrado'
                });
            }

            const gastoActualizado = await CostoModel.update(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Gasto actualizado exitosamente',
                data: gastoActualizado
            });
        } catch (error) {
            console.error('Error al actualizar el gasto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el gasto',
                error: error.message
            });
        }
    },

    // Eliminar un gasto
    deleteGasto: async (req, res) => {
        try {
            const { id } = req.params;
            
            const gastoEliminado = await CostoModel.delete(id);

            if (!gastoEliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Gasto no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Gasto eliminado exitosamente',
                data: gastoEliminado
            });
        } catch (error) {
            console.error('Error al eliminar el gasto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el gasto',
                error: error.message
            });
        }
    },

    // Obtener resumen de costos por lote (Para Dashboard/KPIs)
    getResumenCostos: async (req, res) => {
        try {
            const { idLote } = req.params;
            const resumen = await CostoModel.getResumenByLote(idLote);

            res.status(200).json({
                success: true,
                data: {
                    total_gastos: parseInt(resumen.total_gastos) || 0,
                    costo_total: parseFloat(resumen.costo_total) || 0,
                    costos_fijos: parseFloat(resumen.costos_fijos) || 0,
                    costos_variables: parseFloat(resumen.costos_variables) || 0
                }
            });
        } catch (error) {
            console.error('Error al obtener resumen de costos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el resumen de costos',
                error: error.message
            });
        }
    },

    // Obtener gastos agrupados por categoría
    getGastosPorCategoria: async (req, res) => {
        try {
            const { idLote } = req.params;
            const gastosPorCategoria = await CostoModel.getByCategoria(idLote);

            res.status(200).json({
                success: true,
                data: gastosPorCategoria
            });
        } catch (error) {
            console.error('Error al obtener gastos por categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener gastos por categoría',
                error: error.message
            });
        }
    }
};

module.exports = CostoController;
