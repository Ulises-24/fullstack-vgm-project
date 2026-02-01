const express = require('express');

const usuariosRoutes = require('./usuarios.routes');
const ordenesRoutes = require('./ordenes.routes');
const detalleRoutes = require('./detalleOrden.routes');

const router = express.Router();

router.use('/usuarios', usuariosRoutes);
router.use('/ordenes', ordenesRoutes);
router.use('/detalles_orden', detalleRoutes);

module.exports = router;