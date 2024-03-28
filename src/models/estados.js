const { databaseInstance } = require("./index.js");
const { DataTypes } = require("sequelize");

const Estado = databaseInstance.define("Estados",{
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true,
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{  timestamps: false, }
);

module.exports = { Estado };
