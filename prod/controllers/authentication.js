'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = exports.userLogin = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * controller for user login
 * POST /user/login
 */
var userLogin = exports.userLogin = function userLogin(req, res) {
  var user = null;

  _user2.default.findUserByCredentials(req.body.email, req.body.password).then(function (data) {
    if (!data) {
      return Promise.reject({ 'status': 404 });
    }

    user = data;
    return user.generateAuthToken();
  }).then(function (token) {
    res.header('x-auth', token).send(user);
  }).catch(function (err) {
    var errMessage = err.status === 400 ? 'Email ID and password combination does not matched' : 'Unauthorized, Please contact with admin';

    res.status(err.status || 404).send(errMessage);
  });
};

/**
 * controller for create user
 * POST /user/create (default role: normal)
 */
var createUser = exports.createUser = function createUser(req, res) {
  var user = new _user2.default({
    'name': req.body.name,
    'email': req.body.email,
    'phone': req.body.phone,
    'designation': req.body.designation,
    'password': req.body.credentials.password,
    'dob': req.body.dob ? (0, _moment2.default)(req.body.dob).toDate() : null,
    'doj': req.body.doj ? (0, _moment2.default)(req.body.doj).toDate() : (0, _moment2.default)().toDate(),
    'role': req.body.role || 'normal',
    'previousExp': req.body.previousExp,
    'domain': req.body.domain,
    'skills': req.body.skills,
    'visa': req.body.visa,
    'about': req.body.about
  });

  user.save().then(function (savedUser) {
    if (!savedUser) {
      res.status(400).send('Unable to register, Please check your details');
    }
    return savedUser.generateAuthToken();
  }).then(function (token) {
    res.header('x-auth', token).send(user);
  }).catch(function (err) {
    if (err.message) {
      res.status(400).send(err.message.substring(err.message.lastIndexOf(':') + 1));
    } else {
      res.status(err.status || 400).send('Unable to register, Please check your details');
    }
  });
};