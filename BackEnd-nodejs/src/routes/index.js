const express = require('express');
const router = express.Router();

const usuariosRoutes = require('./models/usuarios.routes');
const ordenesRoutes = require('./models/ordenes.routes');
const detalleRoutes = require('./models/detalleOrden.routes');
const authRoutes = require('./auth');

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Rutas funcionando correctamente!',
    version: '1.0.0'
  });
});

router.use('/usuarios', usuariosRoutes);
router.use('/ordenes', ordenesRoutes);
router.use('/detalles', detalleRoutes);
router.use('/auth', authRoutes);

module.exports = router;