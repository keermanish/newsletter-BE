import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
  'title': {
    'type': String,
    'trime': true,
    'required': [true, 'Please provide work title']
  },
  'description': {
    'type': String,
    'trime': true
  },
  'technology': {
    'type': String,
    'trime': true
  },
  'typeOfWork': {
    'type': String,
    'trime': true,
    'required': [true, 'Please provide type of work']
  },
  'estimation': {
    'type': {
      'type': String,
      'required': [true, 'Please provide type of estimation']
    },
    'value': {
      'type': String
    },
    'startDate': {
      'type': Date
    },
    'endDate': {
      'type': Date
    }
  },
  'spoc': {
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User',
    'required': [true, 'Please provide mention SPOC name']
  },
  'resource': {
    'participants': [{
      'participant': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'User',
        'required': [true, 'Please provide the participant details']
      },
      'timeSpend': {
        'type': Number
      }
    }],
    'vacancy': [{
      'type': {
        'type': String,
        'required': [true, 'Please provide type of vacancy']
      },
      'availablity': {
        'type': Number,
        'required': [true, 'Please provide availablity']
      }
    }]
  }
});

const Work = mongoose.model('Work', workSchema);

export default Work;