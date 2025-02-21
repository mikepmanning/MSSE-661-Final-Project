import express from 'express';
import { login } from '../controllers/authController.js';
import { createUser } from '../controllers/userController.js';

const authRoutes = express.Router();

authRoutes.post('/register', createUser);

authRoutes.post('/login', login);

export default authRoutes;