const express = require('express');
const ordenController = require('../../controllers/ordenes.controller');
const detalleOrdenesRoutes = require('./detalleOrden.routes');
const { validateOrdenes } = require('../../middleware/validator');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, ordenController.getOrdenes);
router.get('/:id_orden', authMiddleware, ordenController.getOrdenById);
router.post('/', authMiddleware, validateOrdenes, ordenController.createOrden);
router.put('/:id_orden', authMiddleware, ordenController.updateOrden);
router.delete('/:id_orden', authMiddleware, ordenController.deleteOrden);
router.use('/detalles', authMiddleware, detalleOrdenesRoutes);

module.exports = router;