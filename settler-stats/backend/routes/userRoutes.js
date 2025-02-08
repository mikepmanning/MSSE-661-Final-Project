const controllers = require('../controllers/userController');
const express = require('express');

const userRoutes = express.Router();
/**
 * Express routes for Users.
 *
 * RESTful endpoints make for easily adding to existing API features.
 */

/**
 * Routes for all users. Evaluates to `/user/`.
 */
userRoutes.get('/', controllers.getAllUsers).post('/', controllers.createUser);

/**
 * Routes for a user by id. Evalutes to `/user/:userId`.
 */
userRoutes
  .get('/me', controllers.getUserByToken)
  .get('/:userId', controllers.getUser)
  .post('/:userId', controllers.updateUser)
  .delete('/:userId', controllers.deleteUser);

  module.exports = userRoutes;
