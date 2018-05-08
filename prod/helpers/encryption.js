'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareDate = exports.hashData = undefined;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * function to encrypt the provided value
 * @param {string} input
 * @returns {promise}
 */
var hashData = exports.hashData = function hashData(input) {
  return new Promise(function (resolve, reject) {
    if (!input) {
      return resolve(input);
    }

    /* https://www.npmjs.com/package/bcrypt#a-note-on-rounds */
    _bcrypt2.default.genSalt(12, function (saltError, salt) {
      if (saltError) {
        return reject(saltError);
      }

      _bcrypt2.default.hash(input, salt, function (hashError, hashedInput) {
        if (hashError) {
          return reject(hashError);
        }

        return resolve(hashedInput);
      });
    });
  });
};

/**
 * function to compare hashed and readable data
 * @param {string} dataToBeCompare
 * @param {string} hashedData
 * @returns {promise}
 */
var compareDate = exports.compareDate = function compareDate(dataToBeCompare, hashedData) {
  return new Promise(function (resolve, reject) {
    _bcrypt2.default.compare(dataToBeCompare, hashedData, function (err, isMatched) {
      if (isMatched) {
        return resolve(true);
      }

      reject(false);
    });
  });
};