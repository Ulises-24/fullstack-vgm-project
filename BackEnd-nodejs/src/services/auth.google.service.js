const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { Usuarios, sequelize } = require('../models'); // ajusta ruta
const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    JWT_SECRET
} = require('../config/environment');
const logger = require('../utils/logger');

const client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    ///GOOGLE_REDIRECT_URI
);

// Scopes mínimos recomendados
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

// 1. Obtener URL de autorización (redirigir al usuario)
const getGoogleAuthUrl = () => {
    try {
        const url = client.generateAuthUrl({
            access_type: 'offline',           // para obtener refresh_token si lo necesitas
            scope: SCOPES,
            prompt: 'select_account',
            client_id: GOOGLE_CLIENT_ID,
            redirect_uri: GOOGLE_REDIRECT_URI         // o 'consent' / 'login'
        });
        logger.info('URL de autorización Google generada');
        return url;
    } catch (error) {
        logger.error('Error generando URL Google', { error: error.message });
        const err = new Error('Error generando URL de autorización');
        err.status = 500;
        throw err;
    }
};

// 2. Intercambiar código por tokens y obtener info del usuario
const verifyGoogleCode = async (code) => {
    try {
        const { tokens } = await client.getToken({
            code,
            redirect_uri: GOOGLE_REDIRECT_URI,
        });

        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        logger.info('Código Google verificado', { email: payload.email });

        return {
            googleId: payload.sub,                  // ID único de Google
            email: payload.email,
            name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
            picture: payload.picture || null,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || null, // solo la primera vez
        };
    } catch (error) {
        logger.error('Error verificando código Google', { error: error.message });
        const err = new Error('Código Google inválido o expirado');
        err.status = 401;
        throw err;
    }
};

// 3. Generar JWT propio
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

// 4. Login - solo si el usuario ya existe
const loginWithGoogle = async (code) => {
    const transaction = await sequelize.transaction();
    try {
        const googleData = await verifyGoogleCode(code);

        const usuario = await Usuarios.findOne({
            where: { correo: googleData.email },
            transaction,
        });

        if (!usuario) {
            const error = new Error('Usuario no encontrado. Regístrate primero.');
            error.status = 404;
            throw error;
        }

        const token = generateJwtToken(usuario);
        await transaction.commit();

        logger.info('Login Google exitoso', { user_id: usuario.id_usuario });

        return {
            usuario: {
                id: usuario.id_usuario,
                nombre_completo: usuario.nombre_completo,
                correo: usuario.correo,
                proveedor_login: 'Google',
            },
            token,
        };
    } catch (error) {
        await transaction.rollback();
        logger.error('Error en login Google', { error: error.message });
        throw error;
    }
};

// 5. Registro - crea usuario si no existe
const registerWithGoogle = async (code) => {
    const transaction = await sequelize.transaction();
    try {
        const googleData = await verifyGoogleCode(code);

        // Verificar si ya existe por email
        let usuario = await Usuarios.findOne({
            where: { correo: googleData.email },
            transaction,
        });

        if (usuario) {
            const error = new Error('El correo ya está registrado. Inicia sesión.');
            error.status = 409;
            throw error;
        }

        // Verificar si ya existe por id_google (por si cambió email)
        usuario = await Usuarios.findOne({
            where: { id_microsoft: googleData.googleId },
            transaction,
        });

        if (usuario) {
            const error = new Error('Cuenta Google ya vinculada a otro usuario.');
            error.status = 409;
            throw error;
        }

        // Crear nuevo usuario
        usuario = await Usuarios.create({
            nombre_completo: googleData.name || 'Usuario Google',
            correo: googleData.email,
            proveedor_login: 'Google',
            id_microsoft: googleData.googleId,
        }, { transaction });

        const token = generateJwtToken(usuario);
        await transaction.commit();

        logger.info('Registro con Google exitoso', { user_id: usuario.id_usuario });

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
        logger.error('Error en registro Google', { error: error.message });
        throw error;
    }
};

module.exports = {
    getGoogleAuthUrl,
    loginWithGoogle,
    registerWithGoogle,
};