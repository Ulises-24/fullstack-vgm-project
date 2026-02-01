const { body, validationResult } = require('express-validator');

const validar = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errores: errors.array().map(err => ({
                campo: err.path,
                mensaje: err.msg
            }))
        });
    }
    next();
};

const validateUsuarios = [
    body('nombre_completo')
        .trim()
        .notEmpty().withMessage('El campo no puede estar vacío.')
        .isString().withMessage('Solo se permite texto'),

    body('correo')
        .trim()
        .notEmpty().withMessage('El campo no puede estar vacío.')
        .isString().withMessage('Solo se permite texto')
        .normalizeEmail(),

    body('proveedor_login')
        .optional() // Es opcional porque tienes un defaultValue en el modelo
        .isIn(['MICROSOFT', 'GOOGLE', 'LOCAL']).withMessage('Proveedor no válido.'),

    body('id_microsoft')
        .notEmpty().withMessage('El ID de Microsoft es obligatorio para este flujo.'),

    body('estado')
        .optional()
        .isBoolean().withMessage('El estado debe ser booleano (true/false).'),

    // Middleware para capturar los errores
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({
                ok: false,
                errors: errores.array()
            });
        }
        next();
    }
];

const validateOrdenes = [
    body('id_usuario')
        .notEmpty().withMessage('El campo no puede estar vacío.')
        .isInt().withMessage('Solo se permiten enteros.'),

    body('total')
        .notEmpty().withMessage('El campo no puede estar vacío.')
        .isFloat().withMessage('Solo se permiten números.'),

    validar
];

module.exports = {
    validateUsuarios,
    validateOrdenes,
};
