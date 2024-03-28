const { databaseInstance } = require('./index.js');
const { DataTypes } = require('sequelize');
const {Area} = require("./area");
const {TipoEquipo} = require("./tipoEquipos");

const Equipos = databaseInstance.define("Equipos",{
    no_inventario:{
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
    },
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
    },
},{
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['no_inventario'],
            using: 'BTREE' // Define el tipo de índice
        }
    ]
})

Equipos.belongsTo(Area, {
    foreignKey: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Equipos.belongsTo(TipoEquipo, {
    foreignKey: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

module.exports = { Equipos }