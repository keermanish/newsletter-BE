'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var applicationPrivateConfig = {
  development: {
    PORT: 3000,
    DB_URL: 'mongodb://makeerd:deloitte2018#3@ds117730.mlab.com:17730/newsletter-be',
    AUTH_KEY: 'NEWSLETTER2017#DDDEVELOP'
  },
  stage: {
    PORT: 3000,
    DB_URL: 'mongodb://makeerd:deloitte2018#3@ds117730.mlab.com:17730/newsletter-be',
    AUTH_KEY: 'NEWSLETTER2017#DDSTAGE'
  },
  production: {
    PORT: 3000,
    DB_URL: 'mongodb://makeerd:deloitte2018#3@ds117730.mlab.com:17730/newsletter-be',
    AUTH_KEY: 'NEWSLETTER2017#DDPRODUCTION'
  }
};


var applicationPublicConfig = {
  'development': {
    "API_URL": "http://localhost:3000"
  },
  "stage": {
    "API_URL": "http://FIXME:3000" // Please change me later
  },
  'production': {
    "API_URL": "https://newsletter-be.herokuapp.com"
  }
};

_cloudinary2.default.config({
  cloud_name: 'makeer02',
  api_key: '158494249426276',
  api_secret: 'c1LuEO4jt6FZzaiOc2_92S829hc'
});

/**
 * common configuration
 * same across all environment
 */
var commonConfigAcrossAllEnv = {
  'OTP_EXPIRY_TIME': 2, /* in hours */

  'REDIS_KEY': 'newsletter:' /* unique seperator to distinguish redis key */
};

/**
 * get environment specific config - default: development
 * this is private configuration - not tracked in git
 */
var runtimePrivateConfig = applicationPrivateConfig[process.env.NODE_ENV || 'development'];

/**
 * get environment specific config - default: development
 * this is public configuration available in git
 */
var runtimePublicConfig = applicationPublicConfig[process.env.NODE_ENV || 'development'];

/* combine both */
var config = Object.assign({}, runtimePrivateConfig, runtimePublicConfig, commonConfigAcrossAllEnv);

exports.default = config;