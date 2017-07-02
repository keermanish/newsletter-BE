import express from 'express';

/* all routes */
import todoRoutes from './todo';
import userRoutes from './user';
import authenticationRoutes from './authentication';

/* all middlewares */
import { isAuthorizedUser } from '../middlewares/authentication';

const routes = express.Router();

/**
 * all todo routes - for refrence
 * POST /todo/create
 */
routes.use('/todo', todoRoutes);

/**
 * all authentication routes
 * POST /user/login
 * POST /user/create
 * DELETE /user/logout
 */
routes.use('/user', authenticationRoutes);

/**
 * all user routes
 * GET /user/:id
 */
routes.use('/user', isAuthorizedUser, userRoutes);

export default routes;
