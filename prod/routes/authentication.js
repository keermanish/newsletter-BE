'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _authentication = require('../controllers/authentication');

var _authentication2 = require('../middlewares/authentication');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* all controllers */
var authenticationRoutes = _express2.default.Router();

/**
 * user login
 * POST /user/login
 */


/* all middleware */
authenticationRoutes.post('/login', _authentication.userLogin);

/**
 * user create
 * POST /user/create
 */
authenticationRoutes.post('/create', _authentication.createUser);

exports.default = authenticationRoutes;