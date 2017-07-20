import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import _ from 'lodash';

import config from '../config/config';

import {
  isValidName,
  isValidEmail,
  isValidPhoneNumber
} from '../helpers/validation';

const userSchema = new mongoose.Schema({
  'name': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide your full name'],
    'validate': {
      'isAsync': false,
      'validator': isValidName,
      'message': 'Please enter a valid full name'
    }
  },
  'phone': {
    'type': String,
    'trim': true,
    'unique': [true, 'Phone number has already been used'],
    'required': [true, 'Please enter your phone number'],
    'validate': {
      'isAsync': false,
      'validator': isValidPhoneNumber,
      'message': 'Please enter a valid phone number'
    }
  },
  'email': {
    'type': String,
    'trim': true,
    'unique': [true, 'Email ID has already been used'],
    'required': [true, 'Please enter your email ID'],
    'validate': {
      'isAsync': false,
      'validator': isValidEmail,
      'message': 'Please enter a valid email'
    }
  },
  'password': {
    'type': String,
    'required': [true, 'Please enter your password'],
    'minlength': [6, 'Password is too weak']
  },
  'designation': {
    'type': String,
    'trim': true,
    'required': [true, 'Please provide your designation'],
    'validate': {
      'isAsync': false,
      'validator': isValidName,
      'message': 'Please enter a valid designation'
    }
  },
  'avatar': {
    'type': String
  },
  'role': {
    'type': String,
    'trim': true,
    'enum': {
      'values': ['admin', 'publisher', 'user'],
      'message': 'Please provide valid user role'
    },
    'required': [true, 'Please enter your role'],
    'default': 'user'
  },
  'status': {
    'type': String,
    'enum': {
      'values': ['active', 'inactive', 'pending']
    },
    'default': 'pending'
  },
  'dob': {
    'type': Date,
    'required': [true, 'Please provide date of birth']
  },
  'doj': {
    'type': Date,
    'required': [true, 'Please provide date of joining']
  }
});

/**
 * instance method (built-in) to skip some data from being send to user
 */
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  const skipFields = ['password'];

  return _.omit(userObject, skipFields);
};

/**
 * instance method to generate auth token for user
 * token gets generate after login/registration
 * function - required 'this'
 */
userSchema.methods.generateAuthToken = function() {
  const user = this;
  const tokenData = Object.assign({
    'access': 'auth'
  }, user.toObject());
  const token = jwt.sign(tokenData, config.AUTH_KEY).toString();

  return Promise.resolve(token);
};

/**
 * model function to find user by auth token
 * useful for login check
 * function - reqtuired 'this'
 * @param {String} teken [user token]
 */
userSchema.statics.findUserByToken = function(token) {
  const user = this;
  var decode = null;

  if(!token) {
    return Promise.reject();
  }

  try {
    decode = jwt.verify(token, config.AUTH_KEY);
  } catch (e) {
    return Promise.reject({'status': 400});
  }

  return user.findOne({'_id': decode._id});
};

/**
 * model funtion to find user by using email and password
 * function - required 'this'
 * @param {String} email [user email]
 * @param {String} password [user password]
 */
userSchema.statics.findUserByCredentials = function(email, password) {
  const user = this;

  return user.findOne({ email })
    .then(res => {
      if(!res) {
        return Promise.reject({'status': 404});
      } else if(res && res.status !== 'active') {
        return Promise.reject({'status': 401});
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, res.password, (err, isMatched) => {
          if(isMatched) {
            return resolve(res);
          }

          reject({'status': 400});
        });
      });
    });
};

/**
 * encypt the password if its changed
 * function - required 'this'
 */
userSchema.pre('save', function(next) {
  const user = this;

  if(user.isModified('password')) {

    /* https://www.npmjs.com/package/bcrypt#a-note-on-rounds */
    bcrypt.genSalt(12, (saltError, salt) => {
      bcrypt.hash(user.password, salt, (hashError, hashedPassword) => {
        user.password = hashedPassword;
        next();
      });
    });
  } else {
    next();
  }
});

/**
 * since mogoose does not provide custom error message for unique fields
 * {PATH} {VALUE} {TYPE}
 */
userSchema.plugin(uniqueValidator, { 'message': 'Error, expected {VALUE} to be unique.' });
const User = mongoose.model('User', userSchema);

export default User;
