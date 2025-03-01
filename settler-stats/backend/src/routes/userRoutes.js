import {getAllUsers, createUser, getUserByToken, getUser, updateUser, deleteUser} from '../controllers/userController.js';
import verifyToken from '../middleware/verifyToken.js';
import express from 'express';

const userRoutes = express.Router();
/**
 * Express routes for Users.
 *
 * RESTful endpoints make for easily adding to existing API features.
 */

/**
 * Routes for all users. Evaluates to `/user/`.
 */
userRoutes.get('/', getAllUsers).post('/', createUser);

/**
 * Routes for a user by id. Evalutes to `/user/:userId`.
 */
userRoutes
  .get('/me', verifyToken, getUserByToken)
  .get('/:userId', getUser)
  .put('/:userId', verifyToken, updateUser)
  .delete('/:userId', deleteUser);

 export default userRoutes;
