import express from 'express';
import path from 'path';

/* all routes */
import todoRoutes from './todo';
import userRoutes from './user';
import roomRoutes from './room';
import workRoutes from './work';
import eventRoutes from './event';
import bookRoomRoutes from './book-room';
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
 * POST /room/new
 * PUT /room/:id
 * DELETE /room/:id
 */
routes.use('/room', isAuthorizedUser, roomRoutes);

/**
 * routes to manage room booking schedule
 * GET /book-room/:search [all/id]
 * POST /book-room/new
 * PUT /book-room/:id
 * DELETE /book-room/:id
 */
routes.use('/book-room', isAuthorizedUser, bookRoomRoutes);

/**
 * routes to manage events
 * GET /event/:search [all/id]
 * POST /event/new
 * PUT /event/:id
 * DELETE /event/:id
 */
routes.use('/event', isAuthorizedUser, eventRoutes);

/**
 * routes to manage work(FI/RFP)
 * GET /work/:search [all/id]
 * POST /work/new
 * PUT /work/:id
 * DELETE /work/:id
 */
routes.use('/work', isAuthorizedUser, workRoutes);

/**
 * all common routes goes here
 * GET /upload/:type/:file
 */
routes.use(commonRoutes);

export default routes;
