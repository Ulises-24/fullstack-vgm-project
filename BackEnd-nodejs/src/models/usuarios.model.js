const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuarios = sequelize.define('Usuarios', {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre_completo: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        proveedor_login: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'MICROSOFT'
        },
        id_microsoft: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true
        },
        fecha_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
    },
    {
        timestamps: false,
        tableName: 'usuarios'
    }
);

module.exports = Usuarios;