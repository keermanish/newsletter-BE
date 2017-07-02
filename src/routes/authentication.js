import express from 'express';

/* all controllers */
import {
  userLogin,
  createUser,
  logoutUser
} from '../controllers/authentication';

/* all middleware */
import {
  isAuthorizedUser
} from '../middlewares/authentication';

const authenticationRoutes = express.Router();

/**
 * user login
 * POST /user/login
 */
authenticationRoutes.post('/login', userLogin);

/**
 * user create
 * POST /user/create
 */
authenticationRoutes.post('/create', createUser);

/**
 * logout current user
 * DELETE /user/logout
 */
authenticationRoutes.delete('/logout', isAuthorizedUser, logoutUser);

export default authenticationRoutes;
