const express = require('express')
const controller = require('../controllers/authController');
const userController = require('../controllers/userController');

const authRoutes = express.Router();

authRoutes.post('/register', userController.createUser);

authRoutes.post('/login', controller.login);

module.exports = authRoutes;