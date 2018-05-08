'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Use native promises */
_mongoose2.default.Promise = global.Promise;

var dbConnection = _mongoose2.default.connect(_config2.default.DB_URL);

/* When successfully connected */
_mongoose2.default.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + _config2.default.DB_URL);
});

/* If the connection throws an error */
_mongoose2.default.connection.on('error', function (err) {
  console.error('Mongoose default connection error ' + err);
});

/* When the connection is disconnected */
_mongoose2.default.connection.on('disconnected', function () {
  console.error('Mongoose default connection disconnected');
});

/* If the Node process ends, close the Mongoose connection */
process.on('SIGINT', function () {
  _mongoose2.default.connection.close(function () {
    console.error('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

exports.default = dbConnection;