const { NODE_ENV } = require('../config/environment');
const logger = require('../utils/logger');

const logout = (req, res) => {
    try {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
        });
        logger.info('Handled POST /auth/logout request');
        res.status(200).json({ success: true, message: 'Sesión cerrada satisfactoriamente' });
    } catch (error) {
        next(error);
    }
};

module.exports = logout;