const { Sequelize } = require('sequelize');

const databaseInstance = new Sequelize({
        dialect: process.env.DATABASE_DIALECT || "mysql",
        host: process.env.DATABASE_HOSTNAME || "localhost",
        database: process.env.DATABASE_NAME || 'biocare_db',
        password: process.env.DATABASE_PASSWORD || '12345678',
        username: process.env.DATABASE_USERNAME || 'root'
    })

// databaseInstance.sync({alter: true})
databaseInstance.sync({alter: true, logging: false})
  .then(() => {console.log("La conexion se establecio correctamente")})
  .catch(reason => { throw new Error(reason)});

module.exports = { databaseInstance };