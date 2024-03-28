const controllerUsuario= require('../controllers/usuarioController')
const express = require('express');
const { verifyJWT } = require('../middlewares/authMiddleware');
const userRoutes = express.Router();

userRoutes
    .get('/', verifyJWT, controllerUsuario.getUsuarios)
    .get('/:id', verifyJWT, controllerUsuario.getUsuario)
    .put('/recuperar', verifyJWT, controllerUsuario.updateUsuarioPassword)
    .put('/:id', verifyJWT, controllerUsuario.updateUsuario)
    .delete('/:id', verifyJWT, controllerUsuario.deleteUsuario);

module.exports = {userRoutes};