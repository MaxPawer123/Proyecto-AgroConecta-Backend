const LoteModel = require('../models/loteModel');
const ProduccionModel = require('../models/produccionModel');

const ProduccionController = {
    createProduccion: async (req, res) => {
        try {
            const {
                id_lote,
                fecha_registro,
                cantidad_obtenida,
                precio_venta,
                estado_sincronizacion,
            } = req.body;

            if (!id_lote || !fecha_registro || !cantidad_obtenida || !precio_venta) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos id_lote, fecha_registro, cantidad_obtenida y precio_venta son obligatorios',
                });
            }

            const cantidad = Number(cantidad_obtenida);
            const precio = Number(precio_venta);

            if (!cantidad || cantidad <= 0 || !precio || precio <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'cantidad_obtenida y precio_venta deben ser mayores a cero',
                });
            }

            const loteExistente = await LoteModel.getById(id_lote);
            if (!loteExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Lote no encontrado',
                });
            }

            const resultado = await ProduccionModel.createAndSyncLote({
                id_lote,
                fecha_registro,
                cantidad_obtenida: cantidad,
                precio_venta: precio,
                estado_sincronizacion,
            });

            return res.status(201).json({
                success: true,
                message: 'Produccion registrada correctamente',
                data: resultado.produccion,
                lote: resultado.lote,
            });
        } catch (error) {
            console.error('Error al registrar produccion:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al registrar la produccion',
                error: error.message,
            });
        }
    },

    getProduccionByLote: async (req, res) => {
        try {
            const { idLote } = req.params;
            const producciones = await ProduccionModel.getByLote(idLote);

            return res.status(200).json({
                success: true,
                data: producciones,
                count: producciones.length,
            });
        } catch (error) {
            console.error('Error al obtener produccion por lote:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener la produccion del lote',
                error: error.message,
            });
        }
    },

    getUltimaProduccionByLote: async (req, res) => {
        try {
            const { idLote } = req.params;
            const produccion = await ProduccionModel.getLatestByLote(idLote);

            if (!produccion) {
                return res.status(404).json({
                    success: false,
                    message: 'No existen registros de produccion para este lote',
                });
            }

            return res.status(200).json({
                success: true,
                data: produccion,
            });
        } catch (error) {
            console.error('Error al obtener ultima produccion del lote:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener la ultima produccion del lote',
                error: error.message,
            });
        }
    },
};

module.exports = ProduccionController;
