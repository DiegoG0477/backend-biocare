const controller = require('../controllers/reporteController');
const { verifyJWT } = require('../middlewares/authMiddleware');
const express = require('express');
const route = express.Router();

const reporteRoutes = route
    .get('/', verifyJWT, controller.getReportes)
    .get('/pdf/:id', verifyJWT, controller.sendFileReporte)
    .get('/pdf/last', verifyJWT, controller.sendFileReporte)
    .get('/:id', verifyJWT, controller.getReporte)
    .post('/', verifyJWT, controller.createReporte)
    .put('/:id', verifyJWT, controller.updateReporte)
    .delete('/:id', verifyJWT, controller.deleteReporte);

module.exports = {reporteRoutes};