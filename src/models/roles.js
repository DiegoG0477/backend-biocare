const { databaseInstance } = require('./index.js')
const { DataTypes } = require('sequelize')

const Rol = databaseInstance.define("Roles", {
    rol: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
}, {
    timestamps: false
})

module.exports = { Rol }