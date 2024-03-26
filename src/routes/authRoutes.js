const authController = require('../controllers/authController');

const express = require('express');

const authRoutes = express.Router();

authRoutes
    .post('/login', authController.login)
    .post('/registro', authController.register);

module.exports = { authRoutes };