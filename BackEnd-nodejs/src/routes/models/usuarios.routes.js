const express = require('express');
const usuarioController = require('../../controllers/usuarios.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { validateUsuarios } = require('../../middleware/validator');
const router = express.Router();

router.get('/', authMiddleware, usuarioController.getUsuarios);
router.get('/:id_usuario', authMiddleware, usuarioController.getUsuarioById);
router.post('/', authMiddleware, validateUsuarios, usuarioController.createUsuario);
router.put('/:id_usuario', authMiddleware, usuarioController.updateUsuario);
router.delete('/:id_usuario', authMiddleware, usuarioController.deleteUsuario);

module.exports = router;