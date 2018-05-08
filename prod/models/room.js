'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validation = require('../helpers/validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roomSchema = new _mongoose2.default.Schema({
  'name': {
    'type': String,
    'trim': true,
    'required': [true, 'Room name is required'],
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidAlphanumeric,
      'message': 'Please enter a valid room name'
    }
  },
  'capacity': {
    'type': Number,
    'required': [true, 'Please provide room capacity'],
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidNumber,
      'message': 'Please enter a valid capacity'
    }
  },
  'location': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide room location']
  }
});

var Room = _mongoose2.default.model('Room', roomSchema);

exports.default = Room;