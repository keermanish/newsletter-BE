import express from 'express';

/* all controllers */
import {
  userLogin,
  createUser
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

export default authenticationRoutes;
