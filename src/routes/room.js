import express from 'express';

import {
  getRoom,
  addNewRoom,
  updateRoom,
  deleteRoom
} from '../controllers/room';

const roomRoutes = express.Router();

/**
 * route to get all/specific stored room info
 * GET /room/:search [all/id]
 */
roomRoutes.get('/:search', getRoom);

/**
 * route to store new room
 * POST /room/new
 */
roomRoutes.post('/new', addNewRoom);

/**
 * route to update room info
 * PUT /room/:id
 */
roomRoutes.put('/:id', updateRoom);

/**
 * route to remove room info
 * DELETE /room/:id
 */
roomRoutes.delete('/:id', deleteRoom);


export default roomRoutes;