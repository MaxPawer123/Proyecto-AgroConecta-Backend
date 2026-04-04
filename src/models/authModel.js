const pool = require('../config/db');

const AuthModel = {
    registerProducer: async ({ nombre, apellido, telefono, pin, departamento, municipio, comunidad }) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const usuarioResult = await client.query(
                `INSERT INTO usuario (nombre, apellido, rol, telefono, estado)
                 VALUES ($1, $2, 'productor', $3, 'activo')
                 RETURNING id_usuario, nombre, apellido, telefono, rol, estado, fecha_registro`,
                [nombre, apellido, telefono]
            );

            const usuario = usuarioResult.rows[0];

            const productorResult = await client.query(
                `INSERT INTO productor (id_usuario, pin, departamento, municipio, comunidad)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING id_productor, id_usuario, departamento, municipio, comunidad`,
                [usuario.id_usuario, pin, departamento, municipio, comunidad]
            );

            await client.query('COMMIT');

            return {
                usuario,
                productor: productorResult.rows[0],
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    findByTelefono: async (telefono) => {
        const result = await pool.query(
            `SELECT
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.rol,
                u.estado,
                u.correo,
                u.telefono,
                u.contrasena,
                u.fecha_registro,
                p.id_productor,
                p.pin,
                p.departamento,
                p.municipio,
                p.comunidad
             FROM usuario u
             INNER JOIN productor p ON p.id_usuario = u.id_usuario
             WHERE u.telefono = $1
             LIMIT 1`,
            [telefono]
        );

        return result.rows[0] || null;
    },

    updatePinByTelefono: async (telefono, nuevoPinHash) => {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const userResult = await client.query(
                `SELECT u.id_usuario, p.id_productor
                 FROM usuario u
                 INNER JOIN productor p ON p.id_usuario = u.id_usuario
                 WHERE u.telefono = $1
                 LIMIT 1`,
                [telefono]
            );

            if (userResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return null;
            }

            const { id_productor } = userResult.rows[0];

            const updateResult = await client.query(
                `UPDATE productor
                 SET pin = $1
                 WHERE id_productor = $2
                 RETURNING id_productor, id_usuario, departamento, municipio, comunidad`,
                [nuevoPinHash, id_productor]
            );

            await client.query('COMMIT');

            return updateResult.rows[0] || null;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },
};

module.exports = AuthModel;