const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleOrden = sequelize.define('DetalleOrden', {
    id_detalle: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_juego: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: 'detalle_orden'
  }
);

module.exports = DetalleOrden;