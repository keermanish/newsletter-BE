import express from 'express';

import multer from 'multer';

import {
  getUser,
  setAvatar
} from '../controllers/user';

import { avatarUpload } from '../config/upload';

const userRoutes = express.Router();

/**
 * route to get user info
 * GET /user/me
 */
userRoutes.get('/me', getUser);

/**
 * route to set user avatar
 * POST /user/avatar
 */
userRoutes.post('/avatar', avatarUpload, setAvatar);

export default userRoutes;