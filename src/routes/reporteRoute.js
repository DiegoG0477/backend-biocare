const controller = require('../controllers/reporteController');
const { verifyJWT } = require('../middlewares/authMiddleware');
const express = require('express');
const route = express.Router();

const reporteRoutes = route
    .get('/', controller.getReportes)
    .get('/pdf/:id', controller.sendFileReporte)
    .get('/pdf/last', controller.sendFileReporte)
    .get('/:id', controller.getReporte)
    .post('/', verifyJWT, controller.createReporte)
    .put('/:id', controller.updateReporte)
    .delete('/:id', controller.deleteReporte)

module.exports = {reporteRoutes};