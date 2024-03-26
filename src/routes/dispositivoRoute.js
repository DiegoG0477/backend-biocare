const controller = require('../controllers/dispositivoController.js');
const express = require('express');
const router = express.Router();

const dispositivosRoutes = router
    .get('/', controller.getDispositivos)
    .get('/:id', controller.getDispositivo)
    .post('/', controller.createDispositivo)
    .put('/:id', controller.updateDispositivo)
    .delete('/:id', controller.deleteDispositivo);


module.exports = { dispositivosRoutes };