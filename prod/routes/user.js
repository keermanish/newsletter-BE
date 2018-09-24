'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _user = require('../controllers/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userRoutes = _express2.default.Router();

/**
 * route to get current user info
 * This imp since token might does not have latest user info
 * GET /user/me
 */
userRoutes.get('/me', _user.getUser);

/**
 * route to get specific user's info
 * GET /user/:id
 */
userRoutes.get('/:id', _user.getUserByID);

/**
 * route to get list of users
 * GET /user/list/:status [all, pending, active]
 */
userRoutes.get('/list/:status', _user.getUserList);

/**
 * route to update specific user
 * PUT /user/:id
 */
userRoutes.put('/:id', _user.updateUser);

/**
 * route to set user avatar
 * POST /user/avatar
 */
userRoutes.post('/avatar', _user.setAvatar);

/**
 * route to logout current user
 * DELETE /user/logout
 */
userRoutes.delete('/logout', _user.logoutCurrentUser);

exports.default = userRoutes;