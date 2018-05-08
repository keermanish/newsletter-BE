'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corsOptions = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var corsOptions = {
  'origin': function origin(_origin, callback) {
    if (!Array.isArray(_config2.default.ALLOWED_ORIGINS)) {
      callback(null, true);

      return true;
    }

    if (_config2.default.ALLOWED_ORIGINS.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  'exposedHeaders': ['x-auth']
};
exports.corsOptions = corsOptions;