import express from 'express';

import {
  getWork,
  addWork,
  updateWork,
  removeWork
} from '../controllers/work';

const workRoutes = express.Router();

/**
 * route to get all/specific work
 * GET /work/:typeOfWork/:search
 * typeOfWork: FI/RFP
 * search all/id
 */
workRoutes.get('/:typeOfWork/:search', getWork);

/**
 * route to create new work
 * POST /work/new
 */
workRoutes.post('/new', addWork);

/**
 * route to update existing work
 * PUT /work/new
 */
workRoutes.put('/:id', updateWork);

/**
 * route to delete existing work
 * DELETE /work/new
 */
workRoutes.delete('/:id', removeWork);

export default workRoutes;