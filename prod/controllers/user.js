'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logoutCurrentUser = exports.updateUser = exports.setAvatar = exports.getUserList = exports.getUserByID = exports.getUser = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _encryption = require('../helpers/encryption');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * controller to get current user info
 * GET /user/me
 */
var getUser = exports.getUser = function getUser(req, res) {

  /**
   * since everything already been done through middleware
   * check isAuthorized middleware which finds the user info based on token
   * and assign it to req object
   */
  res.send(req.user);
};

/**
 * controller to get specific users info
 * GET /user/:id
 */

// import redisClient from '../config/redis';
var getUserByID = exports.getUserByID = function getUserByID(req, res) {
  _user2.default.findById(req.params.id).then(function (user) {
    if (!user) {
      return Promise.reject({ 'status': 404 });
    }

    res.status(200).send(user);
  }).catch(function (err) {
    res.status(err.status || 400).send();
  });
};

/**
 * controller to get list of user
 * GET /user/list/:status [all, pending, active]
 */
var getUserList = exports.getUserList = function getUserList(req, res) {
  var filter = req.params.status === 'all' ? {} : {
    'status': req.params.status
  };

  _user2.default.find(filter).then(function (list) {
    if (!list) {
      return Promise.reject({ 'status': 404 });
    }

    res.status(200).send(list);
  }).catch(function (err) {
    res.status(err.status || 400).send();
  });
};

/**
 * controller to set user avatar/profile pic
 * once image store successfully then delete previous avatar
 * POST /user/avatar
 */
var setAvatar = exports.setAvatar = function setAvatar(req, res) {
  var oldAvatarPath = req.user.avatar;

  _cloudinary2.default.v2.uploader.upload(req.file.path, function (error, result) {
    if (error) {
      return res.status(400).send(error);
    }

    _user2.default.findByIdAndUpdate(req.user._id, {
      '$set': {
        'avatar': result.url
      }
    }, {
      'new': true
    }).then(function (user) {

      res.send(user);
    }).catch(function (err) {
      res.status(400).send('Unable to set profile pic, Please try again');
    });

    return result;
  });
};

/**
 * controller to update user information
 * pass whatever you want update (it should be part of user schema)
 * PUT /user/:id
 */
var updateUser = exports.updateUser = function updateUser(req, res) {
  var userID = req.params.id;
  var userDataToBeUpdated = _lodash2.default.omit(req.body, ['_id']);

  var password = userDataToBeUpdated.credentials ? userDataToBeUpdated.credentials.password : null;

  (0, _encryption.hashData)(password).then(function (hashedPassword) {
    return new Promise(function (resolve, reject) {
      if (hashedPassword) {
        userDataToBeUpdated.password = hashedPassword;
      }

      if (userDataToBeUpdated.status && userDataToBeUpdated.status !== 'active') {
        /* for key operations we need to add prefix manually */
        // redisClient.del(`auth:${userID}`, (err) => {
        //   resolve();
        // });

        resolve();
      } else {
        resolve();
      }
    });
  }).then(function () {
    return _user2.default.findByIdAndUpdate(userID, {
      '$set': userDataToBeUpdated
    }, {
      'new': true,
      'runValidators': true,
      'context': 'query'
    });
  }).then(function (user) {
    if (!user) {
      return Promise.reject({ 'status': 401 });
    }

    res.status(200).send(user);
  }).catch(function (err) {
    if (err.message) {
      res.status(400).send(err.message.substring(err.message.lastIndexOf(':') + 1));
    } else {
      res.status(err.status || 400).send('Unable to register, Please check your details');
    }
  });
};

/**
 * controller to logout current user
 * DELETE /user/logout
 */
var logoutCurrentUser = exports.logoutCurrentUser = function logoutCurrentUser(req, res) {
  var token = req.header('x-auth');

  // redisClient.srem(`auth:${req.user._id}`, [token], err => {
  //   if(err) {
  //     res.status(400).send('Unable to logout');
  //   }

  //   res.status(200).send();
  // });

  res.status(200).send();
};