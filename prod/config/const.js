'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var USER_FIELDS_TO_POPULATE = exports.USER_FIELDS_TO_POPULATE = '_id name email phone designation';

var ALLOWED_USER_DOMAINS = exports.ALLOWED_USER_DOMAINS = ['UX', 'VD', 'FE', 'BE', 'PM', 'BA', 'QA', 'All', 'FX', 'BxD', 'EM', 'iOS', 'Android'];

var AVOID_FIELDS_IN_RESPONSE = exports.AVOID_FIELDS_IN_RESPONSE = ['password', 'otp', 'otpExpire', '__v', 'iat', 'access'];