const ordenesService = require('../services/ordenes.service');
const logger = require('../utils/logger');

const getOrdenes = async (req, res, next) => {
    try {
        const ordenes = await ordenesService.getOrdenes();
        logger.info('Handled GET /ordenes request');
        res.status(200).json({
            success: true,
            data: ordenes
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

const getOrdenById = async (req, res, next) => {
    try {
        const orden = await ordenesService.getOrdenById(req.params.id_orden);
        logger.info(`Handled GET /ordenes/${req.params.id_orden} request`);
        res.status(200).json({
            success: true,
            data: orden
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

const createOrden = async (req, res, next) => {
    try {
        const orden = await ordenesService.createOrden(req.body);
        logger.info('Handled POST /orden request');
        res.status(200).json({
            success: true,
            data: orden
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

const updateOrden = async (req, res, next) => {
    try {
        const orden = await ordenesService.updateOrden(req.params.id_orden, req.body);
        logger.info(`Handled PUT /ordenes/${req.params.id_orden} request`);
        res.status(200).json({
            success: true,
            data: orden
        });
    } catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};

const deleteOrden = async (req, res, next) => {
    try {
        const orden = await ordenesService.deleteOrden(req.params.id_orden);
        logger.info(`Handled DELETE /ordenes/${req.params.id_orden} request`);
        res.status(200).json({
            success: true,
            message: 'Petición aceptada, orden eliminada',
            data: orden
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

module.exports = {
    getOrdenes,
    getOrdenById,
    createOrden,
    updateOrden,
    deleteOrden
};