'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidTime = exports.isValidDate = exports.isValidEmail = exports.isValidPhoneNumber = exports.isValidAlphanumeric = exports.isValidName = exports.isValidNumber = exports.isEmpty = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * all validation functions goes here
                                                                                                                                                                                                                                                                               */

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * function to check whether provided value is empty or not
 * @param  {any}  value [value to be checked]
 * @return {Boolean}
 */
var isEmpty = exports.isEmpty = function isEmpty(value) {
  return !value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === String && !value.trim();
};

/**
 * function to check provided value is number or not
 * @param {*} value 
 */
var isValidNumber = exports.isValidNumber = function isValidNumber(value) {
  var reg = /^\d+$/g;
  return reg.test(value);
};

/**
 * function to validate user name
 * @param {String} value [user name]
 * @returns {Boolean}
 */
var isValidName = exports.isValidName = function isValidName(value) {
  if (isEmpty(value)) {
    return false;
  }

  var reg = /^[a-zA-Z'.\s]+$/g;
  return reg.test(value);
};

/**
 * function to validate alphanumeric
 * @param {String} value
 * @returns {Boolean}
 */
var isValidAlphanumeric = exports.isValidAlphanumeric = function isValidAlphanumeric(value) {
  if (isEmpty(value)) {
    return false;
  }

  var reg = /^[a-zA-Z0-9'.\s]+$/g;
  return reg.test(value);
};

/**
 * function to validate phone number
 * @link https://stackoverflow.com/a/16702965
 */
var isValidPhoneNumber = exports.isValidPhoneNumber = function isValidPhoneNumber(value) {
  if (isEmpty(value)) {
    return false;
  }

  var reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g;
  return reg.test(value);
};

/**
 * function to validate email
 * @link https://stackoverflow.com/a/46181
 */
var isValidEmail = exports.isValidEmail = function isValidEmail(value) {
  if (isEmpty(value)) {
    return false;
  }

  var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(value);
};

/**
 * function to validate date
 * @param {Date/String}
 */
var isValidDate = exports.isValidDate = function isValidDate(value) {
  if (isEmpty(value)) {
    return false;
  }

  return (0, _moment2.default)(value).isValid();
};

/**
 * function to validate time
 * @param {Date/String} - HH:mm
 */
var isValidTime = exports.isValidTime = function isValidTime(value) {
  if (isEmpty(value)) {
    return false;
  }

  return (0, _moment2.default)(value, 'HH:MM').isValid();
};