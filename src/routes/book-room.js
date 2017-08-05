import express from 'express';

import {
  getAllBookedRoomSchedule,
  addSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/book-room';

import { checkRoomAvailablity } from '../middlewares/book-room';

const bookRoomRoutes = express.Router();

/**
 * controller to get all/specific schedules
 * GET /book-room/:search [all/id]
 */
bookRoomRoutes.get('/:search', getAllBookedRoomSchedule);

/**
 * controller to create new schedule
 * POST /book-room/new
 */
bookRoomRoutes.post('/new', checkRoomAvailablity, addSchedule);

/**
 * controller to update schedule info
 * PUT /book-room/:id
 */
bookRoomRoutes.put('/:id', checkRoomAvailablity, updateSchedule);

/**
 * controller to remove schedule info
 * DELETE /book-room/:id
 */
bookRoomRoutes.delete('/:id', deleteSchedule);

export default bookRoomRoutes;