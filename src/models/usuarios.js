const { databaseInstance } = require('./index.js')
const { DataTypes } = require('sequelize')
const {Rol} = require("./roles.js");
const Usuario = databaseInstance.define("Usuarios",{
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
    },
    apellido: {
        type: DataTypes.STRING(255),
    },
},{
    timestamps: false
})

Usuario.belongsTo(Rol, {
    foreignKey: {
        name: "rolId",
        field: "rolId",
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = { Usuario }
