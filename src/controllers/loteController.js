const LoteModel = require('../models/loteModel');
//CONTRORLES DE LOTES 
const LoteController = {
    // Obtener todos los lotes
    getAllLotes: async (req, res) => {
        try {
            const lotes = await LoteModel.getAll();
            res.status(200).json({
                success: true,
                data: lotes,
                count: lotes.length
            });
        } catch (error) {
            console.error('Error al obtener lotes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los lotes',
                error: error.message
            });
        }
    },

    // Obtener un lote por ID
    getLoteById: async (req, res) => {
        try {
            const { id } = req.params;
            const lote = await LoteModel.getById(id);

            if (!lote) {
                return res.status(404).json({
                    success: false,
                    message: 'Lote no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: lote
            });
        } catch (error) {
            console.error('Error al obtener el lote:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener el lote',
                error: error.message
            });
        }
    },

    // Crear un nuevo lote
    createLote: async (req, res) => {
        try {
            const {
                id_productor,
                id_producto,
                nombre_lote,
                superficie,
                fecha_siembra,
                fecha_cosecha_est,
                rendimiento_estimado,
                precio_venta_est,
                foto_siembra_url,
                ubicacion,
                variedad
            } = req.body;

            // Validación básica (foto_siembra_url, ubicacion y variedad son opcionales)
            if (!id_productor || !id_producto || !nombre_lote || !superficie || 
                !fecha_siembra || !fecha_cosecha_est || !rendimiento_estimado || !precio_venta_est) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos obligatorios son: id_productor, id_producto, nombre_lote, superficie, fecha_siembra, fecha_cosecha_est, rendimiento_estimado, precio_venta_est'
                });
            }

            console.log('Creando lote con datos:', {
                nombre_lote,
                superficie,
                foto_siembra_url: foto_siembra_url ? ' Incluida' : 'Sin foto',
                ubicacion: ubicacion || 'No especificada',
                variedad: variedad || 'No especificada'
            });

            const nuevoLote = await LoteModel.create(req.body);

            console.log('Lote creado exitosamente:', nuevoLote.id_lote);

            res.status(201).json({
                success: true,
                message: 'Lote creado exitosamente',
                data: nuevoLote
            });
        } catch (error) {
            console.error('Error al crear el lote:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear el lote',
                error: error.message
            });
        }
    },

    // Actualizar un lote
    updateLote: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar si el lote existe
            const loteExistente = await LoteModel.getById(id);
            if (!loteExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Lote no encontrado'
                });
            }

            const loteActualizado = await LoteModel.update(id, req.body);

            res.status(200).json({
                success: true,
                message: 'Lote actualizado exitosamente',
                data: loteActualizado
            });
        } catch (error) {
            console.error('Error al actualizar el lote:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el lote',
                error: error.message
            });
        }
    },

    // Eliminar un lote
    deleteLote: async (req, res) => {
        try {
            const { id } = req.params;
            
            const loteEliminado = await LoteModel.delete(id);

            if (!loteEliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Lote no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Lote eliminado exitosamente',
                data: loteEliminado
            });
        } catch (error) {
            console.error('Error al eliminar el lote:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el lote',
                error: error.message
            });
        }
    },

    // Obtener lotes por productor
    getLotesByProductor: async (req, res) => {
        try {
            const { idProductor } = req.params;
            const lotes = await LoteModel.getByProductor(idProductor);

            res.status(200).json({
                success: true,
                data: lotes,
                count: lotes.length
            });
        } catch (error) {
            console.error('Error al obtener lotes del productor:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los lotes del productor',
                error: error.message
            });
        }
    }
};

module.exports = LoteController;
