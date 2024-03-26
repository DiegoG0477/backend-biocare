const { databaseInstance } = require('./index.js')
const { DataTypes } = require('sequelize')

const Area = databaseInstance.define("Areas",{
    area: {
        type: DataTypes.STRING(100),
    },
},{
    timestamps: false
})

module.exports = { Area }