const { databaseInstance } = require('./index.js')
const { DataTypes } = require('sequelize');

const TipoEquipo = databaseInstance.define("TipoEquipos",{
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
},{
    timestamps: false
})

module.exports = { TipoEquipo }