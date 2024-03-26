const { databaseInstance } = require("./index.js");
const { DataTypes } = require("sequelize");

const Consumible = databaseInstance.define("Consumibles",{
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{  timestamps: false, }
);

module.exports = { Consumible };
