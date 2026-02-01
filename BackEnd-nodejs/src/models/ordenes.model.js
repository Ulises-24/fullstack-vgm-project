const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Ordenes = sequelize.define('Ordenes', {
    id_orden: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_orden: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.00
    }
  },
  {
    timestamps: false,
    tableName: 'ordenes'
  }
);

module.exports = Ordenes;