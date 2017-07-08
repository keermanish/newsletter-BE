import express from 'express';

import { getUploadedFiles } from './../controllers/common';

const commonRoutes = express.Router();

/**
 * route to get uploaded files/images
 * GET /uploads/:type (avatar)/:file (file name)
 * no need to check is authorized or not
 */
commonRoutes.get('/uploads/:type/:file', getUploadedFiles);

export default commonRoutes;