import mongoose from 'mongoose';

import {
  isValidDate,
  isValidAlphanumeric
} from '../helpers/validation';

const eventSchema = new mongoose.Schema({
  'title': {
    'type': String,
    'trim': true,
    'validate': {
      'isAsync': false,
      'validator': isValidAlphanumeric,
      'message': 'Please enter a valid event title'
    }
  },
  'organiser': {
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User'
  },
  'location': {
    'type': String,
    'required': [true, 'Please provied event venue']
  },
  'slots': [{
    'fromDate': {
      'type': Date,
      'required': [true, 'Please provide slot start date'],
      'validate': {
        'isAsync': false,
        'validator': isValidDate,
        'message': 'Please enter a valid slot start date'
      }
    },
    'toDate': {
      'type': Date,
      'required': [true, 'Please provide slot end date'],
      'validate': {
        'isAsync': false,
        'validator': isValidDate,
        'message': 'Please enter a valid slot end date'
      }
    },
    'fromTime': {
      'type': Date,
      'required': [true, 'Please provide slot start timing'],
      'validate': {
        'isAsync': false,
        'validator': isValidDate,
        'message': 'Please enter a valid slot start time'
      }
    },
    'toTime': {
      'type': Date,
      'required': [true, 'Please provide slot end timing'],
      'validate': {
        'isAsync': false,
        'validator': isValidDate,
        'message': 'Please enter a valid slot end time'
      }
    }
  }],
  'description': {
    'type': String,
    'trim': true,
    'validate': {
      'isAsync': false,
      'validator': isValidAlphanumeric,
      'message': 'Please enter a valid event description'
    }
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
