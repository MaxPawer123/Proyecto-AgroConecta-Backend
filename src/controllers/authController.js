const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/authModel');

const SALT_ROUNDS = 10;

const cleanUserResponse = (row) => ({
    id_usuario: row.id_usuario,
    id_productor: row.id_productor,
    nombre: row.nombre,
    apellido: row.apellido,
    telefono: row.telefono,
    rol: row.rol,
    estado: row.estado,
    departamento: row.departamento,
    municipio: row.municipio,
    comunidad: row.comunidad,
    fecha_registro: row.fecha_registro,
});

const AuthController = {
    me: async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: 'Token válido.',
                data: req.user,
            });
        } catch (error) {
            console.error('Error en me:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno al obtener la sesión.',
                error: error.message,
            });
        }
    },

    register: async (req, res) => {
        try {
            const { nombre, apellido, telefono, pin, departamento, municipio, comunidad } = req.body;

            if (!nombre || !apellido || !telefono || !pin || !departamento || !municipio || !comunidad) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son obligatorios: nombre, apellido, telefono, pin, departamento, municipio y comunidad.',
                });
            }

            if (!/^\d{4,6}$/.test(String(pin))) {
                return res.status(400).json({
                    success: false,
                    message: 'El PIN debe contener entre 4 y 6 dígitos numéricos.',
                });
            }

            const pinHash = await bcrypt.hash(String(pin), SALT_ROUNDS);

            const nuevoRegistro = await AuthModel.registerProducer({
                nombre: String(nombre).trim(),
                apellido: String(apellido).trim(),
                telefono: String(telefono).trim(),
                pin: pinHash,
                departamento: String(departamento).trim(),
                municipio: String(municipio).trim(),
                comunidad: String(comunidad).trim(),
            });

            return res.status(201).json({
                success: true,
                message: 'Productor registrado correctamente.',
                data: cleanUserResponse({
                    ...nuevoRegistro.usuario,
                    ...nuevoRegistro.productor,
                }),
            });
        } catch (error) {
            if (error.code === '23505') {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe un usuario registrado con ese teléfono.',
                });
            }

            console.error('Error en register:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno al registrar el productor.',
                error: error.message,
            });
        }
    },

    login: async (req, res) => {
        try {
            const { telefono, pin } = req.body;

            if (!telefono || !pin) {
                return res.status(400).json({
                    success: false,
                    message: 'Telefono y pin son obligatorios.',
                });
            }

            const usuario = await AuthModel.findByTelefono(String(telefono).trim());

            if (!usuario) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.',
                });
            }

            const pinValido = await bcrypt.compare(String(pin), usuario.pin);

            if (!pinValido) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.',
                });
            }

            const token = jwt.sign(
                {
                    id_usuario: usuario.id_usuario,
                    id_productor: usuario.id_productor,
                    telefono: usuario.telefono,
                    rol: usuario.rol,
                },
                process.env.JWT_SECRET || 'cambiar_este_secreto_en_produccion',
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                token,
                data: cleanUserResponse(usuario),
            });
        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno al iniciar sesión.',
                error: error.message,
            });
        }
    },

    recoverPin: async (req, res) => {
        try {
            const { telefono, nuevo_pin } = req.body;

            if (!telefono || !nuevo_pin) {
                return res.status(400).json({
                    success: false,
                    message: 'Telefono y nuevo_pin son obligatorios.',
                });
            }

            if (!/^\d{4,6}$/.test(String(nuevo_pin))) {
                return res.status(400).json({
                    success: false,
                    message: 'El nuevo PIN debe contener entre 4 y 6 dígitos numéricos.',
                });
            }

            const usuarioExistente = await AuthModel.findByTelefono(String(telefono).trim());

            if (!usuarioExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'No existe un productor registrado con ese teléfono.',
                });
            }

            const nuevoPinHash = await bcrypt.hash(String(nuevo_pin), SALT_ROUNDS);

            await AuthModel.updatePinByTelefono(String(telefono).trim(), nuevoPinHash);

            return res.status(200).json({
                success: true,
                message: 'PIN actualizado correctamente.',
            });
        } catch (error) {
            console.error('Error en recoverPin:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno al recuperar el PIN.',
                error: error.message,
            });
        }
    },
};

module.exports = AuthController;