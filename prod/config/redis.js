'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * create redis clint with default configuration
 * prefix: unique seperator to distinguish redis key
 */
var redisClient = _redis2.default.createClient({
  'prefix': _config2.default.REDIS_KEY
});

redisClient.on('connect', function () {
  console.log('Redis is connected with default config');
});

redisClient.on('error', function () {
  console.log('Error while connecting with Redis');
});

exports.default = redisClient;