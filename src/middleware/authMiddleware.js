const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado.',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cambiar_este_secreto_en_produccion');

        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado.',
        });
    }
};

module.exports = authMiddleware;