const detalleOrdenService = require('../services/detalleOrden.service');
const logger = require('../utils/logger');

const getDetallesOrdenByOrden = async (req, res, next) => {
  try {
    const { id_orden } = req.params;

    const limpioId = String(id_orden).replace(/\D/g, '');

    if (!limpioId) {
      return res.status(400).json({ success: false, message: 'ID de orden inválido' });
    }

    const detalles = await detalleOrdenService.getDetallesPorOrden(limpioId);

    logger.info(`Detalles encontrados para orden ${limpioId}: ${detalles.length}`);

    res.status(200).json({
      success: true,
      data: detalles
    });
  } catch (error) {
    logger.error(`Error en getDetallesOrdenByOrden: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

const getDetalleOrdenById = async (req, res, next) => {
  try {
    const id_orden = req.params.id_orden;
    const detalles = await detalleOrdenService.getDetallesPorOrden(id_orden);

    console.log(`Buscando productos para Orden ID ${id_orden}. Encontrados: ${detalles.length}`);

    res.status(200).json({
      success: true,
      data: Array.isArray(detalles) ? detalles : [detalles]
    });
  } catch (error) {
    logger.error(`Error en GET /ordenes/detalles/${req.params.id_orden}: ${error.message}`);

    const statusCode = error.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error interno del servidor',
      data: null
    });
  }
};


const createDetalleOrdenes = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.createDetalleOrdenes(req.body);

    logger.info(`Handled POST /ordenes/detalles request`);
    res.status(201).json({
      success: true,
      data: detalle,
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

const updateDetalleOrdenes = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.updateDetalleOrdenes(req.params.id_detalle, req.body);
    logger.info(`Handled PUT /ordenes/detalles/${req.params.id_detalle} request`);
    res.status(200).json({
      success: true,
      data: detalle,
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

const deleteDetalleOrdenes = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.deleteDetalleOrdenes(req.params.id_detalle);
    logger.info(`Handled DELETE /ordenes/detalles/${req.params.id_detalle} request`);
    res.status(200).json({
      success: true,
      message: 'Peticion aceptada, detalle de orden eliminado',
      data: detalle
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

module.exports = {
  getDetallesOrdenByOrden,
  getDetalleOrdenById,
  createDetalleOrdenes,
  updateDetalleOrdenes,
  deleteDetalleOrdenes
};