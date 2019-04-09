'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPassword = exports.sendOTPLink = exports.getUploadedFiles = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _email = require('../config/email');

var _email2 = _interopRequireDefault(_email);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * controller to get uploaded files/images
 * GET /uploads/:type (avatar)/:file (file name)
 */
var getUploadedFiles = exports.getUploadedFiles = function getUploadedFiles(req, res) {
  if (req.params.type && req.params.file) {
    res.sendFile(_path2.default.join(__dirname, './../../uploads', req.params.type, req.params.file));
  } else {
    res.status(404).send('No such file or directory');
  }
};

/**
 * controller to send forgot password link
 * POST /forgot-password
 * required email
 */
var sendOTPLink = exports.sendOTPLink = function sendOTPLink(req, res) {
  var email = req.body.email;

  if (!email) {
    return res.status(400).send('Please provide email ID');
  }

  _user2.default.findOne({ email: email }).then(function (user) {
    if (!user) {
      return Promise.reject({ 'status': 404 });
    }

    return user.generateOTP();
  }).then(function (user) {
    var mailOptions = {
      from: 'keermanishdev@gmail.com',
      to: req.body.email,
      subject: 'Studiofy - Password Reset - OTP',
      text: 'OTP - ' + user.otp + ' and User ID - ' + user._id
    };

    _email2.default.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        console.log('Email sent: ', info.response);
        res.status(200).send('OTP has been sent to ' + req.body.email);
      }
    });
  }).catch(function (err) {
    var errCode = err && err.status ? err.status : 400;
    var errMsg = errCode === 404 ? 'No such user registered' : 'Error while sending reset password link, Please try again';

    res.status(errCode).send(errMsg);
  });
};

/**
 * controller to reset the password
 * POST /reset-password
 * required otp, userID, password
 */
var resetPassword = exports.resetPassword = function resetPassword(req, res) {
  var userID = req.body.userID;
  var otp = req.body.otp;
  var password = req.body.password;

  if (!userID || !otp || !password) {
    return res.status(400).send('Unable to reset password, Please provide required data');
  }

  _user2.default.findById(userID).then(function (user) {
    if (!user) {
      return Promise.reject({ 'status': 404 });
    }

    return user.verifyOTPAndResetPassword(otp, password);
  }).then(function (user) {
    res.status(200).send('Password has been reset successfully');
  }).catch(function (err) {
    var errCode = err && err.status ? err.status : 400;
    var errMsg = errCode === 404 ? 'No such user registered' : 'Reset password link has expired, Please try again';

    res.status(errCode).send(errMsg);
  });
};