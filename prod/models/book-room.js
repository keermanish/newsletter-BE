'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validation = require('../helpers/validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bookRoomSchema = new _mongoose2.default.Schema({
  'title': {
    'type': String,
    'trim': true,
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidAlphanumeric,
      'message': 'Please enter a valid meeting title'
    }
  },
  'bookBy': {
    'type': _mongoose2.default.Schema.Types.ObjectId,
    'ref': 'User'
  },
  'location': {
    'type': _mongoose2.default.Schema.Types.ObjectId,
    'ref': 'Room'
  },
  'slots': [{
    'fromDate': {
      'type': Date,
      'required': [true, 'Please provide slot start date'],
      'validate': {
        'isAsync': false,
        'validator': _validation.isValidDate,
        'message': 'Please enter a valid slot start date'
      }
    },
    'toDate': {
      'type': Date,
      'required': [true, 'Please provide slot end date'],
      'validate': {
        'isAsync': false,
        'validator': _validation.isValidDate,
        'message': 'Please enter a valid slot end date'
      }
    },
    'fromTime': {
      'type': Date,
      'required': [true, 'Please provide slot start timing'],
      'validate': {
        'isAsync': false,
        'validator': _validation.isValidDate,
        'message': 'Please enter a valid slot start time'
      }
    },
    'toTime': {
      'type': Date,
      'required': [true, 'Please provide slot end timing'],
      'validate': {
        'isAsync': false,
        'validator': _validation.isValidDate,
        'message': 'Please enter a valid slot end time'
      }
    }
  }],
  'description': {
    'type': String,
    'trim': true,
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidAlphanumeric,
      'message': 'Please enter a valid meeting description'
    }
  }
});

var BookRoom = _mongoose2.default.model('BookRoom', bookRoomSchema);

exports.default = BookRoom;