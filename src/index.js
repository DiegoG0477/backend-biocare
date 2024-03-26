//////////////////////Arranque de aplicación/////////////////////////////
/////////////////////////////////////////////////////////////////////////
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { router } = require('./routes/index.js');
const cors = require('cors');

//////////Variables globales //////////
const PORT = process.env.port || 4000

////////// Inicialización //////////
const app = express();

////////// Configuración //////////
app.set('port', PORT || 4000);

////////// Middlewares //////////
app.use(cors())
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // Para aceptar los formularios de los usuarios.
app.use(express.json());

//              ROUTER                 //
app.use('/', router);


////////// Public //////////
app.use(express.static(path.join(__dirname, 'public')));

////////// Start Server //////////
app.listen(PORT, () => {
    console.log('Server | PORT', PORT)
});