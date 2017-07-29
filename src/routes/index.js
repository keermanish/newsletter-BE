import express from 'express';
import path from 'path';

/* all routes */
import todoRoutes from './todo';
import userRoutes from './user';
import roomRoutes from './room';
import authenticationRoutes from './authentication';

/* all common routes goes here */
import commonRoutes from './common';

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

/**
 * routes to manage room
 * GET /room/:search [all/id]
 * POST /room/:id
 * PUT /room/:id
 * DELETE /room/:id
 */
routes.use('/room', isAuthorizedUser, roomRoutes);

/**
 * all common routes goes here
 * GET /upload/:type/:file
 */
routes.use(commonRoutes);

export default routes;
