import express from 'express';

import {
  getAllEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setEventPic
} from '../controllers/event';

import { eventPicUpload } from '../config/upload';

const eventRoutes = express.Router();

/**
 * controller to get all/specific events
 * GET /event/:search [all/id]
 */
eventRoutes.get('/:search', getAllEvents);

/**
 * controller to create new event
 * POST /event/new
 */
eventRoutes.post('/new', addEvent);

/**
 * controller to update event info
 * PUT /event/:id
 */
eventRoutes.put('/:id', updateEvent);

/**
 * route to set event avatar
 * POST /event/avatar
 */
eventRoutes.post('/pic/:id', eventPicUpload, setEventPic);

/**
 * controller to remove event info
 * DELETE /event/:id
 */
eventRoutes.delete('/:id', deleteEvent);

export default eventRoutes;