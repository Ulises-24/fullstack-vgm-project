const authMicrosoftService = require('../services/auth.microsoft.service');
const logger = require('../utils/logger');

const { NODE_ENV } = require('../config/environment');


// 1. Obtener URL de autorización Microsoft
const getMicrosoftAuthUrl = async (req, res, next) => {
    try {
        const url = await authMicrosoftService.getMicrosoftAuthUrl();

        logger.info('Handled GET /auth/microsoft/url request');

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


// 2. Login con Microsoft
const loginWithMicrosoft = async (req, res, next) => {
    try {
        const { code } = req.body;

        const { usuario, token } = await authMicrosoftService.loginWithMicrosoft(code);

        // Guardar JWT en cookie (igual que Google)
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });

        logger.info('Handled POST /auth/microsoft/login request', { id_usuario: usuario.id });

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión con Microsoft exitoso',
            data: { usuario }
        });

    } catch (error) {
        res.status(error.status || 401).json({
            success: false,
            message: error.message || 'Error al iniciar sesión con Microsoft',
            data: null
        });
        next(error);
    }
};


// 3. Registro con Microsoft
const registerWithMicrosoft = async (req, res, next) => {
    try {
        const { code } = req.body;

        const { usuario, token } = await authMicrosoftService.registerWithMicrosoft(code);

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        logger.info('Handled POST /auth/microsoft/register request', { id_usuario: usuario.id });

        res.status(201).json({
            success: true,
            message: 'Registro con Microsoft exitoso',
            data: { usuario }
        });

    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message || 'Error al registrar con Microsoft',
            data: null
        });
        next(error);
    }
};


// 4. Callback de Microsoft (solo para recibir el code)
/*
const getMicrosoftCallback = async (req, res, next) => {
    try {
        const { code } = req.query;

        logger.info('Handled GET /auth/microsoft/callback request');

        res.status(200).json({
            success: true,
            message: 'Código Microsoft recibido correctamente',
            code: code
        });

    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Error al obtener callback con Microsoft',
            data: null
        });
        next(error);
    }
};
*/

const getMicrosoftCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        logger.info('Handled GET /auth/microsoft/callback request');

        if (!code) {
            logger.warn('Callback de Microsoft sin código');
            return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
        }

        res.redirect(`${FRONTEND_URL}/auth/callback?code=${code}`);

    } catch (error) {
        logger.error('Error en callback de Microsoft:', error);
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${FRONTEND_URL}/login?error=callback_failed`);
    }
};


module.exports = {
    getMicrosoftAuthUrl,
    loginWithMicrosoft,
    registerWithMicrosoft,
    getMicrosoftCallback
};
