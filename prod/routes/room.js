'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _room = require('../controllers/room');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roomRoutes = _express2.default.Router();

/**
 * route to get all/specific stored room info
 * GET /room/:search [all/id]
 */
roomRoutes.get('/:search', _room.getRoom);

/**
 * route to store new room
 * POST /room/new
 */
roomRoutes.post('/new', _room.addNewRoom);

/**
 * route to update room info
 * PUT /room/:id
 */
roomRoutes.put('/:id', _room.updateRoom);

/**
 * route to remove room info
 * DELETE /room/:id
 */
roomRoutes.delete('/:id', _room.deleteRoom);

exports.default = roomRoutes;