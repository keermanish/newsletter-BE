import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    'required': [true, 'Please provide your name'],
    'validate': {
      'isAsync': false,
      'validator': isValidName,
      'message': 'Please enter a valid name'
    }
  },
  'number': {
    'type': String,
    'unique': true,
    'trim': true,
    'required': [true, 'Please enter your phone number'],
    'validate': {
      'isAsync': false,
      'validator': isValidPhoneNumber,
      'message': 'Please eneter a valid phone number'
    }
  },
  'email': {
    'type': String,
    'unique': true,
    'required': [true, 'Please enter your email ID'],
    'trim': true,
    'validate': {
      'isAsync': false,
      'validator': isValidEmail,
      'message': 'Please enter a valid email'
    }
  },
  'role': {
    'type': String,
    'trim': true,
    'required': true,
    'default': 'normal' /* normal, admin - to manage access level */
  },
  'password': {
    'type': String,
    'required': [true, 'Please enter your password'],
    'minlength': [6, 'Password is too weak']
  },
  'tokens': [{
    'access': {
      'type': String,
      'required': true
    },
    'token': {
      'type': String,
      'required': true
    }
  }]
});

/**
 * instance method (built-in) to skip some data from being send to user
 */
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  const skipFields = ['password', 'tokens'];

  return _.omit(userObject, skipFields);
};

/**
 * instance method to generate auth token for user
 * token gets generate after login/registration
 * function - required 'this'
 */
userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    '_id': user._id.toHexString(),
    access
  }, config.AUTH_KEY).toString();

  user.tokens.push({token, access});

  return user.save()
    .then(() => {
      return token;
    });
};

/**
 * instance method to remove user token
 * useful for logout
 * function - reqtuired 'this'
 * @param {String} token [user token]
 */
userSchema.methods.removeToken = function(token) {
  const user = this;

  if(!token) {
    return Promise.reject();
  }

  return user.update({
    '$pull': {
      'tokens': { token }
    }
  });
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

  return user.findOne({
    '_id': decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
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

const User = mongoose.model('User', userSchema);

export default User;
