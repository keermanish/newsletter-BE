'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongooseUniqueValidator = require('mongoose-unique-validator');

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _otpGenerator = require('otp-generator');

var _otpGenerator2 = _interopRequireDefault(_otpGenerator);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _encryption = require('../helpers/encryption');

var _const = require('../config/const');

var _validation = require('../helpers/validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userSchema = new _mongoose2.default.Schema({
  'name': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide your full name']
    // 'validate': {
    //   'isAsync': false,
    //   'validator': isValidName,
    //   'message': 'Please enter a valid full name'
    // }
  },
  'phone': {
    'type': String,
    'trim': true,
    'unique': [true, 'Phone number has already been used'],
    'required': [true, 'Please enter your phone number'],
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidPhoneNumber,
      'message': 'Please enter a valid phone number'
    }
  },
  'email': {
    'type': String,
    'trim': true,
    'unique': [true, 'Email ID has already been used'],
    'required': [true, 'Please enter your email ID'],
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidEmail,
      'message': 'Please enter a valid email'
    }
  },
  'password': {
    'type': String,
    'required': [true, 'Please enter your password']
    //'minlength': [6, 'Password is too weak']
  },
  'designation': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide your designation'],
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidName,
      'message': 'Please enter a valid designation'
    }
  },
  'avatar': {
    'type': String
  },
  'role': {
    'type': String,
    'trim': true,
    'enum': {
      'values': ['admin', 'publisher', 'user'],
      'message': 'Please provide valid user role'
    },
    'required': [true, 'Please enter your role'],
    'default': 'user'
  },
  'status': {
    'type': String,
    'enum': {
      'values': ['active', 'inactive', 'pending']
    },
    'default': 'pending'
  },
  'dob': {
    'type': Date,
    'required': [true, 'Please provide date of birth']
  },
  'doj': {
    'type': Date,
    'required': [true, 'Please provide date of joining']
  },
  'otp': {
    'type': String,
    'trim': true,
    'default': ''
  },
  'otpExpire': {
    'type': Date
  },
  'skills': {
    'type': String,
    'trim': true,
    'default': ''
  },
  'visa': {
    'type': String,
    'trim': true,
    'default': ''
  },
  'about': {
    'type': String,
    'trim': true,
    'default': ''
  },
  'previousExp': {
    'type': Number,
    'required': [true, 'Please enter your previous experience']
  },
  'domain': {
    'type': String,
    'enum': {
      'values': _const.ALLOWED_USER_DOMAINS,
      'message': 'Please provide valid domain'
    },
    'required': [true, 'Please enter your domain']
  }
});

/**
 * instance method (built-in) to skip some data from being send to user
 */

// import redisClient from '../config/redis';
userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _lodash2.default.omit(userObject, _const.AVOID_FIELDS_IN_RESPONSE);
};

/**
 * instance method to generate auth token for user
 * token gets generate after login/registration
 * function - required 'this'
 */
userSchema.methods.generateAuthToken = function () {
  var user = this;
  var tokenData = Object.assign({
    'access': 'auth'
  }, user.toObject());

  /* create token */
  var token = _jsonwebtoken2.default.sign(tokenData, _config2.default.AUTH_KEY).toString();

  return new Promise(function (resolve, reject) {

    /* put token into redis */
    // redisClient.sadd(`auth:${user._id}`, token, err => {
    //   if(err) {
    //     reject();
    //   }

    //   return resolve(token);
    // });
    resolve(token);
  });
};

/**
 * instance method to generate otp
 * token has expiration in hours
 * function - required 'this'
 */
userSchema.methods.generateOTP = function () {
  var user = this;

  var otp = _otpGenerator2.default.generate(8, {
    'upperCase': false,
    'specialChars': false
  });

  user.otp = otp;
  user.otpExpire = (0, _moment2.default)().add(_config2.default.OTP_EXPIRY_TIME, 'h').toDate();

  return user.save();
};

/**
 * instance method to verify otp and its expiry
 * if otp is valid then reset the password
 * function - required 'this'
 */
userSchema.methods.verifyOTPAndResetPassword = function (providedOTP, newPassword) {
  var user = this;

  /* compare otp and verify otp expiry */
  if (user.otp && user.otp === providedOTP && (0, _moment2.default)().diff((0, _moment2.default)(user.otpExpire)) < 0) {
    user.otp = '';
    user.otpExpire = (0, _moment2.default)().subtract(_config2.default.OTP_EXPIRY_TIME, 'h').toDate();
    user.password = newPassword;

    return user.save();
  } else {
    return Promise.reject({ 'status': 400 });
  }
};

/**
 * model function to find user by auth token
 * useful for login check
 * function - reqtuired 'this'
 * @param {String} teken [user token]
 */
userSchema.statics.findUserByToken = function (token) {
  var decode = null;
  var user = this;

  if (!token) {
    return Promise.reject({ 'status': 401 });
  }

  try {

    /* check whether token is valid or not */
    decode = _jsonwebtoken2.default.verify(token, _config2.default.AUTH_KEY);

    if (!decode) {
      throw Error('401');
    }
  } catch (e) {
    return Promise.reject({ 'status': 401 });
  }

  return user.findOne({
    _id: decode._id,
    status: 'Active'
  }).then(function (data) {
    if (!data) {
      return Promise.reject({ 'status': 401 });
    }

    return _lodash2.default.omit(decode, _const.AVOID_FIELDS_IN_RESPONSE);
  }).catch(function (err) {
    return Promise.reject({ 'status': 401 });
  });
};

/**
 * model funtion to find user by using email and password
 * function - required 'this'
 * @param {String} email [user email]
 * @param {String} password [user password]
 */
userSchema.statics.findUserByCredentials = function (email, password) {
  var user = this;

  return user.findOne({ email: email }).then(function (res) {
    if (!res) {
      return Promise.reject({ 'status': 404 });
    } else if (res && res.status !== 'active') {
      return Promise.reject({ 'status': 401 });
    }

    return (0, _encryption.compareDate)(password, res.password).then(function () {
      return Promise.resolve(res);
    }).catch(function () {
      return Promise.reject({
        'status': 400
      });
    });
  });
};

/**
 * encypt the password if its changed
 * function - required 'this'
 */
userSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {

    (0, _encryption.hashData)(user.password).then(function (hashedPassword) {
      user.password = hashedPassword;

      next();
    });
  } else {
    next();
  }
});

/**
 * since mogoose does not provide custom error message for unique fields
 * {PATH} {VALUE} {TYPE}
 */
userSchema.plugin(_mongooseUniqueValidator2.default, { 'message': '{PATH}' });

var User = _mongoose2.default.model('User', userSchema);

exports.default = User;