const express = require('express');
const detalleOrdenesController = require('../../controllers/detalleOrden.controller');
const { validateDetalles } = require('../../middleware/validator');

const router = express.Router();

router.get(
    '/orden/:id_orden',
    detalleOrdenesController
        .getDetallesOrdenByOrden
);
router.get('/:id_detalle', detalleOrdenesController.getDetalleOrdenById);
router.post('/', detalleOrdenesController.createDetalleOrdenes);
router.put('/:id_detalle', detalleOrdenesController.updateDetalleOrdenes);
router.delete('/:id_detalle', detalleOrdenesController.deleteDetalleOrdenes);

module.exports = router;