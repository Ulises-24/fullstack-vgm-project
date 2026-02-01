const { Ordenes, Usuarios, DetalleOrden, sequelize } = require('../models');
const logger = require('../utils/logger');

const getOrdenes = async () => {
  try {
    const ordenes = await Ordenes.findAll({
      attributes: ['id_orden', 'id_usuario', 'fecha_orden', 'total'],
      include: [{
        model: Usuarios,
        attributes: ['nombre_completo']
      }]
    });
    logger.info('Ordenes obtenidas satisfactoriamente', { count: ordenes.length });
    return ordenes;
  } catch (error) {
    logger.error('Error obteniendo Ordenes', { error: error.message });
    throw error;
  }
};

const getOrdenById = async (id) => {
  try {
    const orden = await Ordenes.findByPk(id, {
      attributes: ['id_orden', 'id_usuario', 'fecha_orden', 'total'],
      include: [
        {
          model: Usuarios,
          attributes: ['nombre_completo']
        },
        {
          model: DetalleOrden,
          attributes: ['id_detalle', 'nombre_producto', 'cantidad', 'precio_unitario']
        }
      ]
    });

    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      throw error;
    }

    logger.info('Orden obtenida satisfactoriamente', { orden_id: id });
    return orden;
  } catch (error) {
    logger.error('Error obteniendo orden', { orden_id: id, error: error.message });
    throw error;
  }
};

const createOrden = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const { id_usuario, total, DetalleOrdens } = data;

    const usuario = await Usuarios.findByPk(id_usuario, { transaction });
    if (!usuario) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }

    const orden = await Ordenes.create(
      {
        id_usuario,
        total: total,
        DetalleOrdens
      },
      {
        include: [DetalleOrden],
        transaction
      }
    );

    await transaction.commit();
    return orden;
  } catch (error) {
    await transaction.rollback();
    console.error("Error al guardar monto:", error);
    throw error;
  }
};

const updateOrden = async (id_orden, data) => {
  const t = await sequelize.transaction();

  try {
    const orden = await Ordenes.findByPk(id_orden, { transaction: t });
    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      throw error;
    }

    await orden.update({
      id_usuario: data.id_usuario,
      total: data.total,
      estado: data.estado
    }, { transaction: t });

    await DetalleOrden.destroy({
      where: { id_orden: id_orden },
      transaction: t
    });

    if (data.DetalleOrdens && data.DetalleOrdens.length > 0) {
      const nuevosDetalles = data.DetalleOrdens.map(det => ({
        id_orden: id_orden,
        nombre_juego: det.nombre_juego,    // <-- Verifica que este nombre sea igual en tu Modelo
        cantidad: parseInt(det.cantidad),
        precio_unitario: parseFloat(det.precio_unitario),
        subtotal: parseFloat(det.subtotal)
      }));

      await DetalleOrden.bulkCreate(nuevosDetalles, { transaction: t });
    }

    await t.commit();
    return orden;

  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const deleteOrden = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const orden = await Ordenes.findByPk(id, { transaction });
    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      throw error;
    }

    await orden.destroy({ transaction });
    await transaction.commit();
    logger.info('Orden eliminada satisfactoriamente', { orden_id: id });
    return orden;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error al eliminar Orden', { error: error.message });
    throw error;
  }
};

module.exports = {
  getOrdenes,
  getOrdenById,
  createOrden,
  updateOrden,
  deleteOrden
}