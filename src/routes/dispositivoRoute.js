const controller = require('../controllers/dispositivoController.js');
const express = require('express');
const { verifyJWT } = require('../middlewares/authMiddleware.js');
const router = express.Router();

const dispositivosRoutes = router
    .get('/', verifyJWT, controller.getDispositivos)
    .get('/:id', verifyJWT, controller.getDispositivo)
    .get('/:area/:tipo/', verifyJWT, controller.getDispositivosByAreaAndType)
    .post('/', verifyJWT, controller.createDispositivo)
    .put('/:id', verifyJWT, controller.updateDispositivo)
    .delete('/:id', verifyJWT, controller.deleteDispositivo);


module.exports = { dispositivosRoutes };