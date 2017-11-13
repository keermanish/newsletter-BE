import mongoose from 'mongoose';

import {
  isValidDate
} from '../helpers/validation';

import { ALLOWED_USER_DOMAINS } from '../config/const';

const workSchema = new mongoose.Schema({
  'name': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide work name']
  },
  'description': {
    'type': String,
    'trim': true
  },
  'technology': {
    'type': [String],
    'trim': true
  },
  'projectType': {
    'type': String,
    'trim': true,
    'enum': {
      'values': ['FI', 'RFP'],
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
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User',
    'required': [true, 'Please provide mention contact person']
  },
  'members': [{
    'member': {
      'type': mongoose.Schema.Types.ObjectId,
      'ref': 'User',
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
        'values': ALLOWED_USER_DOMAINS,
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

const Work = mongoose.model('Work', workSchema);

export default Work;