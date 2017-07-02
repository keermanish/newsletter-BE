import express from 'express';

import { getUser } from '../controllers/user';

const userRoutes = express.Router();

/**
 * route to get user info
 * GET /user/me
 */
userRoutes.get('/me', getUser);

export default userRoutes;