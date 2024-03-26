const express = require('express');
const router = express.Router();
const { userRoutes } = require('./usuarioRoute.js');
const { dispositivosRoutes } = require('./dispositivoRoute.js')
const { reporteRoutes } = require('./reporteRoute.js')
const { authRoutes } = require('./authRoutes.js');

router.use('/usuarios', userRoutes); //OK
router.use('/equipos', dispositivosRoutes); //OK
router.use('/reportes', reporteRoutes); //OK
router.use('/auth', authRoutes); //OK

module.exports = {router};
