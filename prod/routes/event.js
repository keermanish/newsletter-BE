'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _event = require('../controllers/event');

var _upload = require('../config/upload');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventRoutes = _express2.default.Router();

/**
 * controller to get all/specific events
 * GET /event/:search [all/id]
 */
eventRoutes.get('/:search', _event.getAllEvents);

/**
 * controller to create new event
 * POST /event/new
 */
eventRoutes.post('/new', _event.addEvent);

/**
 * controller to update event info
 * PUT /event/:id
 */
eventRoutes.put('/:id', _event.updateEvent);

/**
 * route to set event avatar
 * POST /event/avatar
 */
eventRoutes.post('/pic', _upload.eventPicUpload, _event.setEventPic);

/**
 * controller to remove event info
 * DELETE /event/:id
 */
eventRoutes.delete('/:id', _event.deleteEvent);

exports.default = eventRoutes;