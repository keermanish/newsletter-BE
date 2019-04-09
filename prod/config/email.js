'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _nodemailer2.default.createTransport({
  service: 'gmail',
  auth: {
    user: 'keermanishdev@gmail.com',
    pass: 'vbkoqiifwalgplbd'
  }
});