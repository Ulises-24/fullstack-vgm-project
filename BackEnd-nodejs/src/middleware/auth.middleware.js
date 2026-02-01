const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/environment');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Acceso denegado: No se proporcionó token',
            error: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Token inválido o expirado',
            error: error.message
        });
    }
};

module.exports = authMiddleware;