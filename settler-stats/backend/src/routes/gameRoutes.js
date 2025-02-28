import {getAllGamesByUser, createGame, getGame, updateGame, deleteGame, getAllGames} from '../controllers/gameController.js';
import verifyToken from '../middleware/verifyToken.js';
import express from 'express';

const gameRoutes = express.Router();
/**
 * Express routes for Games.
 *
 * RESTful endpoints make for easily adding to existing API features.
 */

/**
 * Routes for all games. Evaluates to `/game/`.
 */
gameRoutes.get('/', verifyToken, getAllGames)
    .post('/', verifyToken, createGame);

/**
 * Routes for a game by id. Evalutes to `/game/:gameId`.
 */
gameRoutes
  .get('/user/:userId', verifyToken, getAllGamesByUser)
  .get('/:gameId', verifyToken, getGame)
  .put('/:gameId', verifyToken, updateGame)
  .delete('/:gameId', verifyToken, deleteGame);

 export default gameRoutes;
