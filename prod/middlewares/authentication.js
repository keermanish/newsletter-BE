'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthorizedUser = undefined;

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * a middleware to find user info based on token passed
 * if user is present then call next routes
 */
var isAuthorizedUser = exports.isAuthorizedUser = function isAuthorizedUser(req, res, next) {
  var token = req.header('x-auth');

  _user2.default.findUserByToken(token).then(function (user) {
    if (!user) {
      return Promise.reject({ 'status': 401 });
    }

    req.user = user;
    req.token = token;

    next();
  }).catch(function (err) {
    res.status(401).send('Unauthorized, Please login');
  });
};