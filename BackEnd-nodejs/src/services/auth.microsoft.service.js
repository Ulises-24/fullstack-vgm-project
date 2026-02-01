const { ConfidentialClientApplication } = require('@azure/msal-node');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Usuarios, sequelize } = require('../models');
const {
    MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET,
    MICROSOFT_TENANT_ID,
    MICROSOFT_REDIRECT_URI,
    JWT_SECRET
} = require('../config/environment');
const logger = require('../utils/logger');

// Cliente MSAL
const msalClient = new ConfidentialClientApplication({
    auth: {
        clientId: MICROSOFT_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}`,
        clientSecret: MICROSOFT_CLIENT_SECRET
    }
});

// Scopes mínimos recomendados para login
const SCOPES = ['openid', 'profile', 'email', 'User.Read'];


// 1. Obtener URL de autorización (redirigir al usuario)
const getMicrosoftAuthUrl = async () => {
    try {
        const url = await msalClient.getAuthCodeUrl({
            scopes: SCOPES,
            redirectUri: MICROSOFT_REDIRECT_URI,
            prompt: 'select_account'
        });

        logger.info('URL de autorización Microsoft generada');
        return url;
    } catch (error) {
        logger.error('Error generando URL Microsoft', { error: error.message });
        const err = new Error('Error generando URL de autorización Microsoft');
        err.status = 500;
        throw err;
    }
};


// 2. Intercambiar código por tokens y obtener info del usuario
const verifyMicrosoftCode = async (code) => {
    try {
        const tokenResponse = await msalClient.acquireTokenByCode({
            code,
            scopes: SCOPES,
            redirectUri: MICROSOFT_REDIRECT_URI
        });

        const accessToken = tokenResponse.accessToken;

        // Obtener datos del usuario desde Microsoft Graph
        const { data } = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        logger.info('Código Microsoft verificado', { email: data.mail || data.userPrincipalName });

        return {
            microsoftId: data.id,
            email: data.mail || data.userPrincipalName,
            name: data.displayName,
            picture: null, // Microsoft no devuelve foto aquí fácilmente
            accessToken,
            refreshToken: tokenResponse.refreshToken || null
        };

    } catch (error) {
        logger.error('Error verificando código Microsoft', { error: error.message });
        const err = new Error('Código Microsoft inválido o expirado');
        err.status = 401;
        throw err;
    }
};


// 3. Generar JWT propio (igual que en Google)
const generateJwtToken = (user) => {
    try {
        const payload = {
            id: user.id_usuario,
            email: user.correo,
            name: user.nombre_completo,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        logger.info('JWT generado', { user_id: user.id_usuario });
        return token;
    } catch (error) {
        logger.error('Error generando JWT', { error: error.message });
        throw error;
    }
};


// 4. Login con Microsoft (solo si el usuario ya existe)
const loginWithMicrosoft = async (code) => {
    const transaction = await sequelize.transaction();

    try {
        const microsoftData = await verifyMicrosoftCode(code);

        const usuario = await Usuarios.findOne({
            where: { correo: microsoftData.email },
            transaction,
        });

        if (!usuario) {
            const error = new Error('Usuario no encontrado. Regístrate primero.');
            error.status = 404;
            throw error;
        }

        const token = generateJwtToken(usuario);
        await transaction.commit();

        logger.info('Login Microsoft exitoso', { user_id: usuario.id_usuario });

        return {
            usuario: {
                id: usuario.id_usuario,
                nombre_completo: usuario.nombre_completo,
                correo: usuario.correo,
                proveedor_login: 'Microsoft',
            },
            token,
        };

    } catch (error) {
        await transaction.rollback();
        logger.error('Error en login Microsoft', { error: error.message });
        throw error;
    }
};


// 5. Registro con Microsoft
const registerWithMicrosoft = async (code) => {
    const transaction = await sequelize.transaction();

    try {
        const microsoftData = await verifyMicrosoftCode(code);

        // Verificar si ya existe por email
        let usuario = await Usuarios.findOne({
            where: { correo: microsoftData.email },
            transaction,
        });

        if (usuario) {
            const error = new Error('El correo ya está registrado. Inicia sesión.');
            error.status = 409;
            throw error;
        }

        // Verificar si ya existe por id_microsoft
        usuario = await Usuarios.findOne({
            where: { id_microsoft: microsoftData.microsoftId },
            transaction,
        });

        if (usuario) {
            const error = new Error('Cuenta Microsoft ya vinculada a otro usuario.');
            error.status = 409;
            throw error;
        }

        // Crear nuevo usuario
        usuario = await Usuarios.create({
            nombre_completo: microsoftData.name || 'Usuario Microsoft',
            correo: microsoftData.email,
            proveedor_login: 'Microsoft',
            id_microsoft: microsoftData.microsoftId,
        }, { transaction });

        const token = generateJwtToken(usuario);
        await transaction.commit();

        logger.info('Registro con Microsoft exitoso', { user_id: usuario.id_usuario });

        return {
            usuario: {
                id: usuario.id_usuario,
                nombre_completo: usuario.nombre_completo,
                correo: usuario.correo,
            },
            token,
        };

    } catch (error) {
        await transaction.rollback();
        logger.error('Error en registro Microsoft', { error: error.message });
        throw error;
    }
};


module.exports = {
    getMicrosoftAuthUrl,
    loginWithMicrosoft,
    registerWithMicrosoft,
};
