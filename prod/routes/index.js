'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _todo = require('./todo');

var _todo2 = _interopRequireDefault(_todo);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _room = require('./room');

var _room2 = _interopRequireDefault(_room);

var _work = require('./work');

var _work2 = _interopRequireDefault(_work);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _bookRoom = require('./book-room');

var _bookRoom2 = _interopRequireDefault(_bookRoom);

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _common = require('./common');

var _common2 = _interopRequireDefault(_common);

var _authentication3 = require('../middlewares/authentication');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* all common routes goes here */
var routes = _express2.default.Router();

/**
 * all todo routes - for refrence
 * POST /todo/create
 */


/* all middlewares */


/* all routes */
routes.use('/todo', _todo2.default);

/**
 * all authentication routes
 * POST /user/login
 * POST /user/create
 * DELETE /user/logout
 */
routes.use('/user', _authentication2.default);

/**
 * all user routes
 * GET /user/:id
 */
routes.use('/user', _authentication3.isAuthorizedUser, _user2.default);

/**
 * routes to manage room
 * GET /room/:search [all/id]
 * POST /room/new
 * PUT /room/:id
 * DELETE /room/:id
 */
routes.use('/room', _authentication3.isAuthorizedUser, _room2.default);

/**
 * routes to manage room booking schedule
 * GET /book-room/:search [all/id]
 * POST /book-room/new
 * PUT /book-room/:id
 * DELETE /book-room/:id
 */
routes.use('/book-room', _authentication3.isAuthorizedUser, _bookRoom2.default);

/**
 * routes to manage events
 * GET /event/:search [all/id]
 * POST /event/new
 * PUT /event/:id
 * DELETE /event/:id
 */
routes.use('/event', _authentication3.isAuthorizedUser, _event2.default);

/**
 * routes to manage work(FI/RFP)
 * GET /work/:search [all/id]
 * POST /work/new
 * PUT /work/:id
 * DELETE /work/:id
 */
routes.use('/work', _authentication3.isAuthorizedUser, _work2.default);

/**
 * all common routes goes here
 * GET /upload/:type/:file
 */
routes.use(_common2.default);

exports.default = routes;