const authGoogleService = require('../services/auth.google.service');
const logger = require('../utils/logger');

const { NODE_ENV } = require('../config/environment');

const getGoogleAuthUrl = async (req, res, next) => {
    try {
        const url = await authGoogleService.getGoogleAuthUrl();
        logger.info('Handled GET /auth/google/url request');
        res.status(200).json({
            success: true,
            data: { url }
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            data: null
        });
        next(error);
    }
};

const loginWithGoogle = async (req, res, next) => {
    try {
        const { code } = req.body;
        const { usuario, token } = await authGoogleService.loginWithGoogle(code);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });

        logger.info('Handled POST /auth/google/login request', { id_usuario: usuario.id });

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión con Google exitoso',
            data: { usuario }
        });
    } catch (error) {
        res.status(error.status || 401).json({
            success: false,
            message: error.message || 'Error al iniciar sesión con Google',
            data: null
        });
        next(error);
    }
};

const registerWithGoogle = async (req, res, next) => {
    try {
        const { code } = req.body;
        const { usuario, token } = await authGoogleService.registerWithGoogle(code);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        logger.info('Handled POST /auth/google/register request', { id_usuario: usuario.id });

        res.status(201).json({
            success: true,
            message: 'Registro con Google exitoso',
            data: { usuario }
        });
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message || 'Error al registrar con Google',
            data: null
        });
        next(error);
    }
};

/*
const getGoogleCallback = async (req, res) => {
    try {
        const { code } = req.query;

        logger.info('Handled GET /auth/google/callback request');

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'No se recibió el código de Google en el callback',
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: 'Código recibido correctamente',
            code
        });
    } catch (error) {
        logger.error(error);

        res.status(500).json({
            success: false,
            message: error.message || 'Error al obtener callback con Google',
            data: null
        });
    }
};
*/

const getGoogleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        logger.info('Handled GET /auth/google/callback request');

        if (!code) {
            logger.warn('Callback de Google sin código');
            return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
        }

        res.redirect(`${FRONTEND_URL}/auth/callback?code=${code}`);

    } catch (error) {
        logger.error('Error en callback de Google:', error);
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${FRONTEND_URL}/login?error=callback_failed`);
    }
};

module.exports = {
    getGoogleAuthUrl,
    loginWithGoogle,
    registerWithGoogle,
    getGoogleCallback
};