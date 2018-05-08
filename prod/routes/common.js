'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _common = require('./../controllers/common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonRoutes = _express2.default.Router();

/**
 * route to get uploaded files/images
 * GET /uploads/:type (avatar)/:file (file name)
 * no need to check is authorized or not
 */
commonRoutes.get('/uploads/:type/:file', _common.getUploadedFiles);

/**
 * route to send forgot password link
 * POST /forgot-password
 * required email
 */
commonRoutes.post('/forgot-password', _common.sendOTPLink);

/**
 * route to reset the password
 * POST /reset-password
 * required otp, userID, password
 */
commonRoutes.post('/reset-password', _common.resetPassword);

exports.default = commonRoutes;