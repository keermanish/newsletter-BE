'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bookRoom = require('../controllers/book-room');

var _bookRoom2 = require('../middlewares/book-room');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bookRoomRoutes = _express2.default.Router();

/**
 * controller to get all/specific schedules
 * GET /book-room/:search [all/id]
 */
bookRoomRoutes.get('/:search', _bookRoom.getAllBookedRoomSchedule);

/**
 * controller to create new schedule
 * POST /book-room/new
 */
bookRoomRoutes.post('/new', _bookRoom2.checkRoomAvailablity, _bookRoom.addSchedule);

/**
 * controller to update schedule info
 * PUT /book-room/:id
 */
bookRoomRoutes.put('/:id', _bookRoom2.checkRoomAvailablity, _bookRoom.updateSchedule);

/**
 * controller to remove schedule info
 * DELETE /book-room/:id
 */
bookRoomRoutes.delete('/:id', _bookRoom.deleteSchedule);

exports.default = bookRoomRoutes;