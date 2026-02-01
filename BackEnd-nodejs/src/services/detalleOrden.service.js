const { DetalleOrden, Ordenes, sequelize } = require('../models');
const logger = require('../utils/logger');

const getDetallesPorOrden = async (idOrden) => {
    try {
        const detalles = await DetalleOrden.findAll({
            where: { id_orden: idOrden },
            order: [['id_detalle', 'ASC']]
        });
        logger.info('Detalles de la Orden obtenidos satisfactoriamente', { orden_id: idOrden, count: detalles.length });
        return detalles;
    } catch (error) {
        logger.error('Error obteniendo Detalles de la Orden', { orden_id: idOrden, error: error.message });
        throw error;
    }
};

const getDetalleOrdenById = async (idDetalle) => {
    try {
        const detalle = await DetalleOrden.findByPk(idDetalle);
        if (!detalle) {
            const error = new Error('Detalle de Orden no encontrado');
            error.status = 404;
            throw error;
        }
        logger.info('Detalle de la Orden obtenido satisfactoriamente', { detalle_id: idDetalle });
        return detalle;
    } catch (error) {
        logger.error('Error obteniendo detalle de la orden', { detalle_id: idDetalle, error: error.message });
        throw error;
    }
};

const createDetalleOrdenes = async ({ id_orden, nombre_juego, cantidad, precio_unitario }) => {
    const transaction = await sequelize.transaction();
    try {
        const orden = await Ordenes.findByPk(id_orden, { transaction });
        if (!orden) {
            const error = new Error('Orden no encontrada para crear detalle');
            error.status = 404;
            throw error;
        }

        const subtotal = cantidad * precio_unitario;
        if (subtotal <= 0) {
            throw new Error('El subtotal debe ser mayor a 0');
        }

        const detalle = await DetalleOrden.create(
            { id_orden, nombre_juego, cantidad, precio_unitario, subtotal },
            { transaction }
        );

        await updateOrdenTotal(id_orden, transaction);

        await transaction.commit();
        logger.info('Detalle de la Orden creado satisfactoriamente', { id_orden, nombre_juego });
        return detalle;
    } catch (error) {
        await transaction.rollback();
        logger.error('Error al crear Detalle de Orden', { error: error.message });
        throw error;
    }
};

const updateDetalleOrdenes = async (idDetalle, { id_orden, nombre_juego, cantidad, precio_unitario }) => {
    const transaction = await sequelize.transaction();
    try {
        const detalle = await DetalleOrden.findByPk(idDetalle, { transaction });
        if (!detalle) {
            const error = new Error('Detalle de Orden no encontrado');
            error.status = 404;
            throw error;
        }

        let ordenDestinoId = id_orden || detalle.id_orden;
        if (id_orden && id_orden !== detalle.id_orden) {
            const nuevaOrden = await Ordenes.findByPk(id_orden, { transaction });
            if (!nuevaOrden) {
                const error = new Error('La nueva orden especificada no existe');
                error.status = 404;
                throw error;
            }
        }

        let nuevoSubtotal = detalle.subtotal;
        if (cantidad !== undefined || precio_unitario !== undefined) {
            const q = cantidad !== undefined ? cantidad : detalle.cantidad;
            const p = precio_unitario !== undefined ? precio_unitario : detalle.precio_unitario;
            nuevoSubtotal = q * p;
            if (nuevoSubtotal <= 0) throw new Error('El nuevo subtotal debe ser mayor a 0');
        }

        const idOrdenOriginal = detalle.id_orden;

        await detalle.update(
            {
                id_orden: ordenDestinoId,
                nombre_juego: nombre_juego || detalle.nombre_juego,
                cantidad: cantidad !== undefined ? cantidad : detalle.cantidad,
                precio_unitario: precio_unitario !== undefined ? precio_unitario : detalle.precio_unitario,
                subtotal: nuevoSubtotal
            },
            { transaction }
        );

        await updateOrdenTotal(idOrdenOriginal, transaction);
        if (ordenDestinoId !== idOrdenOriginal) {
            await updateOrdenTotal(ordenDestinoId, transaction);
        }

        await transaction.commit();
        logger.info('Detalle de la Orden actualizado satisfactoriamente', { detalle_id: idDetalle });
        return detalle;
    } catch (error) {
        await transaction.rollback();
        logger.error('Error al actualizar Detalle de Orden', { error: error.message });
        throw error;
    }
};

const deleteDetalleOrdenes = async (idDetalle) => {
    const transaction = await sequelize.transaction();
    try {
        const detalle = await DetalleOrden.findByPk(idDetalle, { transaction });
        if (!detalle) {
            const error = new Error('Detalle de Orden no encontrado');
            error.status = 404;
            throw error;
        }

        const idOrden = detalle.id_orden;
        await detalle.destroy({ transaction });

        await updateOrdenTotal(idOrden, transaction);

        await transaction.commit();
        logger.info('Detalle de la Orden eliminado satisfactoriamente', { detalle_id: idDetalle });
        return detalle;
    } catch (error) {
        await transaction.rollback();
        logger.error('Error al eliminar Detalle de Orden', { error: error.message });
        throw error;
    }
};

const updateOrdenTotal = async (idOrden, transaction) => {
    try {
        const detalles = await DetalleOrden.findAll({
            where: { id_orden: idOrden },
            transaction
        });

        const total = detalles.reduce((sum, d) => sum + parseFloat(d.subtotal || 0), 0);

        await Ordenes.update(
            { total: total.toFixed(2) },
            { where: { id_orden: idOrden }, transaction }
        );

        logger.info('Total de la Orden recalculado', { orden_id: idOrden, nuevo_total: total.toFixed(2) });
    } catch (error) {
        logger.error('Error al recalcular total de Orden', { error: error.message });
        throw error;
    }
};

// Exportación con los nombres que espera tu controlador
module.exports = {
    getDetallesPorOrden,
    getDetalleOrdenById,
    createDetalleOrdenes,
    updateDetalleOrdenes,
    deleteDetalleOrdenes,
    updateOrdenTotal
};