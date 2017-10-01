import mongoose from 'mongoose';

import {
  isValidDate
} from '../helpers/validation';

const workSchema = new mongoose.Schema({
  'title': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide work title']
  },
  'description': {
    'type': String,
    'trim': true
  },
  'technology': {
    'type': String,
    'trim': true
  },
  'typeOfWork': {
    'type': String,
    'trim': true,
    'enum': {
      'values': ['FI', 'RFP'],
      'message': 'Please provide valid work type'
    },
    'required': [true, 'Please provide type of work']
  },
  'estimation': {
    'type': {
      'type': String,
      'enum': {
        'values': ['Daily Hours', 'Total Hours', 'Total Days'],
        'message': 'Please provide valid estimation type'
      },
      'required': [true, 'Please provide type of estimation']
    },
    'value': {
      'type': String
    },
    'startDate': {
      'type': Date,
      'validate': {
        'isAsync': false,
        'validator': isValidDate,
        'message': 'Please enter a valid estimation start date'
      }
    },
    'endDate': {
      'type': Date,
      'validate': {
        'isAsync': false,
        'validator': isValidDate,
        'message': 'Please enter a valid estimation end date'
      }
    }
  },
  'spoc': {
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User',
    'required': [true, 'Please provide mention SPOC name']
  },
  'participants': [{
    'participant': {
      'type': mongoose.Schema.Types.ObjectId,
      'ref': 'User',
      'required': [true, 'Please provide the participant details']
    },
    'timeSpend': {
      'type': Number,
      'default': 0
    }
  }],
  'vacancy': [{
    'type': {
      'type': String,
      'enum': {
        'values': ['UX', 'VD', 'FE', 'BE', 'PM', 'BA'],
        'message': 'Please provide valid vacancy type'
      },
      'required': [true, 'Please provide type of vacancy']
    },
    'availablity': {
      'type': Number,
      'required': [true, 'Please provide availablity']
    }
  }]
});

const Work = mongoose.model('Work', workSchema);

export default Work;