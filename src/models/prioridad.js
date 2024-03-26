const { databaseInstance } = require('./index.js')
const { DataTypes } = require('sequelize')
const Prioridad = databaseInstance.define("Prioridad",{
    valor: {
        type: DataTypes.STRING(300),
    }
},{
    timestamps: false
})
module.exports = { Prioridad }
