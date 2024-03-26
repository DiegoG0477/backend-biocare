const mysql = require('mysql');
// Convertido de código de callbacks a promesas
const { promisify } = require('util');

const { database } = require('./keys');

// Configuración: conexión más cercana a un entorno de producción
// Validación de errores.
const pool = mysql.createPool(database);

console.log('database', database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED')
        }   

    if (connection) connection.release();
    console.log('La base de datos esta conectada...');
    return;
});

// para realizar consultas ahora se pueden usar promesas: Promisify Pool
pool.query = promisify(pool.query);


module.exports = pool;
