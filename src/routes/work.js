import express from 'express';

import {
  getWork,
  addWork,
  updateWork,
  removeWork
} from '../controllers/work';

const workRoutes = express.Router();

workRoutes.get('/:search', getWork);

workRoutes.post('/new', addWork);

workRoutes.put('/:id', updateWork);

workRoutes.delete('/:id', removeWork);