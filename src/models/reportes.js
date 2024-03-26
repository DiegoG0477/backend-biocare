const { databaseInstance } = require('./index.js')
const { DataTypes, INTEGER} = require('sequelize');
const {Prioridad} = require("./prioridad");
const {Usuario} = require("./usuarios");
const {TipoReporte} = require("./tipoReportes");
const {Area} = require("./area");
const {Consumible} = require("./consumible");

const Reportes = databaseInstance.define("Reportes",{
    descripcion: {
        type: DataTypes.STRING(400),
    },
    falloReportado: {
        type: DataTypes.STRING(100),
    },
    tipoEquipoReportado: {
        type: DataTypes.STRING(100),
    },
    fecha: {
        type: DataTypes.DATE,
        get() {
            const rawDate = this.getDataValue('fecha')
            return new Date(rawDate)
        }
    },
    capacitacionSolicitada: {
        type: DataTypes.STRING(100),
    }
},{
    timestamps: false
})

Reportes.belongsTo(Prioridad, {
    foreignKey: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

Reportes.belongsTo(TipoReporte, {
    foreignKey: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Reportes.belongsTo(Usuario, {
    foreignKey: {type:DataTypes.INTEGER, allowNull: false}
})

Reportes.belongsTo(Area, {
    foreignKey: {type:DataTypes.INTEGER, allowNull: false}
})

Reportes.belongsTo(Consumible, {
    foreignKey: {type:DataTypes.INTEGER, allowNull: false}
})



module.exports = { Reportes }
