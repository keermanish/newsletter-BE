import mongoose from 'mongoose';

import {
  isValidTime,
  isValidDate,
  isValidAlphanumeric
} from '../helpers/validation';

const bookRoomSchema = new mongoose.Schema({
  'title': {
    'type': String,
    'trim': true,
    'validate': {
      'isAsync': false,
      'validator': isValidAlphanumeric,
      'message': 'Please enter a valid meeting title'
    }
  },
  'bookBy': {
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User'
  },
  'location': {
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'Room'
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
      'message': 'Please enter a valid meeting description'
    }
  }
});


const BookRoom = mongoose.model('BookRoom', bookRoomSchema);

export default BookRoom;