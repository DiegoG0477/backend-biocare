const { databaseInstance } = require('./index.js')
const { DataTypes } = require('sequelize')
const {Area} = require("./area");
const {Reportes} = require("./reportes");

const Equipos = databaseInstance.define("Equipos",{
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING(100),
    },
    modelo: {
        type: DataTypes.STRING(100),
    },
    descripcion: {
        type: DataTypes.STRING(511),
    },
    fecha_instalacion: {
        type: DataTypes.DATE,
        default: new Date()
    }
},{
    timestamps: false
})

Equipos.belongsTo(Area, {
    foreignKey: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

// Equipos.hasOne(Reportes, {
//     foreignKey: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// })

module.exports = { Equipos }
