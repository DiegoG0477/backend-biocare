const { databaseInstance } = require('./index');
const {DataTypes} = require('sequelize');
const TipoReporte = databaseInstance.define('TipoReportes', {
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, { timestamps: false})

module.exports = { TipoReporte }