const usuariosService = require('../services/usuarios.service');
const logger = require('../utils/logger');

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await usuariosService.getUsuarios();
    logger.info('Handled GET /usuarios request');
    res.status(200).json({
      success: true,
      data: usuarios
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al obtener usuarios',
      data: null
    });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuariosService.getUsuarioById(req.params.id_usuario);
    logger.info(`Handled GET /usuarios/${req.params.id_usuario} request`);
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al obtener usuario',
      data: null
    });
  }
};

const createUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.createUsuario(req.body);
    logger.info(`Handled POST /usuarios request`);
    res.status(201).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al crear usuario',
      data: null
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.updateUsuario(req.params.id_usuario, req.body);
    logger.info(`Handled PUT /usuarios/${req.params.id_usuario} request`);
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al actualizar usuario',
      data: null
    });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.deleteUsuario(req.params.id_usuario);
    logger.info(`Handled DELETE /usuarios/${req.params.id_usuario} request`);
    res.status(200).json({
      success: true,
      message: 'Petición aceptada, usuario eliminado',
      data: usuario
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al eliminar usuario',
      data: null
    });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
