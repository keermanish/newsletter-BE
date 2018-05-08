'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validation = require('../helpers/validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @TODO - add 'image' field in this schema

var eventSchema = new _mongoose2.default.Schema({
  'title': {
    'type': String,
    'trim': true,
    'validate': {
      'isAsync': false,
      'validator': _validation.isValidAlphanumeric,
      'message': 'Please enter a valid event title'
    }
  },
  'organiser': {
    'type': _mongoose2.default.Schema.Types.ObjectId,
    'ref': 'User'
  },
  'location': {
    'type': String,
    'required': [true, 'Please provied event venue']
  },
  'invitees': {
    'type': String,
    'trim': true,
    'default': ''
  },
  'notes': {
    'type': String,
    'trim': true,
    'default': ''
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
      'message': 'Please enter a valid event description'
    }
  }
});

var Event = _mongoose2.default.model('Event', eventSchema);

exports.default = Event;