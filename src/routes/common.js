import express from 'express';

import {
  getUploadedFiles,
  sendOTPLink,
  resetPassword
} from './../controllers/common';

const commonRoutes = express.Router();

/**
 * route to get uploaded files/images
 * GET /uploads/:type (avatar)/:file (file name)
 * no need to check is authorized or not
 */
commonRoutes.get('/uploads/:type/:file', getUploadedFiles);

/**
 * route to send forgot password link
 * POST /forgot-password
 * required email
 */
commonRoutes.post('/forgot-password', sendOTPLink);

/**
 * route to reset the password
 * POST /reset-password
 * required otp, userID, password
 */
commonRoutes.post('/reset-password', resetPassword);

export default commonRoutes;