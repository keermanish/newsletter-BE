'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validation = require('../helpers/validation');

var _const = require('../config/const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var workSchema = new _mongoose2.default.Schema({
  'name': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide work name']
  },
  'description': {
    'type': String,
    'trim': true
  },
  'technologies': [{
    'technology': {
      'type': String,
      'required': [true, 'Please provide the participant details']
    }
  }],
  'projectType': {
    'type': String,
    'trim': true,
    'enum': {
      'values': ['FI', 'RFP', 'POC'],
      'message': 'Please provide valid work type'
    },
    'required': [true, 'Please provide type of work']
  },
  'estimation': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide estimation of the work']
  },
  'contactPerson': {
    'type': _mongoose2.default.Schema.Types.ObjectId,
    'ref': 'User',
    'required': [true, 'Please provide mention contact person']
  },
  'members': [{
    'member': {
      'type': String,
      'required': [true, 'Please provide the participant details']
    },
    'timeSpend': {
      'type': Number,
      'default': 0
    }
  }],
  'vacancies': [{
    'domain': {
      'type': String,
      'enum': {
        'values': _const.ALLOWED_USER_DOMAINS,
        'message': 'Please provide valid vacancy type'
      },
      'required': [true, 'Please provide type of vacancy']
    },
    'count': {
      'type': Number,
      'required': [true, 'Please provide availablity count']
    }
  }]
});

var Work = _mongoose2.default.model('Work', workSchema);

exports.default = Work;