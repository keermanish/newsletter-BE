import mongoose from 'mongoose';

import {
  isValidAlphanumeric,
  isValidNumber
} from '../helpers/validation';

const roomSchema = new mongoose.Schema({
  'name': {
    'type': String,
    'trim': true,
    'required': [true, 'Room name is required'],
    'validate': {
      'isAsync': false,
      'validator': isValidAlphanumeric,
      'message': 'Please enter a valid room name'
    }
  },
  'capacity': {
    'type': Number,
    'required': [true, 'Please provide room capacity'],
    'validate': {
      'isAsync': false,
      'validator': isValidNumber,
      'message': 'Please enter a valid capacity'
    }
  },
  'location': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide room location']
  }
});

const Room = mongoose.model('Room', roomSchema);

export default Room;