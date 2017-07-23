import express from 'express';
import moment from 'moment';

import User from '../models/user';

/**
 * controller for user login
 * POST /user/login
 */
export const userLogin = (req, res) => {
  let user = null;

  User.findUserByCredentials(req.body.email, req.body.password)
    .then(data => {
      if(!data) {
        return Promise.reject({'status': 404});
      }

      user = data;
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      const errMessage = err.status === 400 ?
      'Email ID and password combination does not matched' :
      'Please enter a valid details';

      res.status(err.status || 404).send(errMessage);
    });
};

/**
 * controller for create user
 * POST /user/create (default role: normal)
 */
export const createUser = (req, res) => {
  var user = new User({
    'name': req.body.name,
    'email': req.body.email,
    'phone': req.body.phone,
    'designation': req.body.designation,
    'password': req.body.credentials.password,
    'dob': req.body.dob ? moment(req.body.dob).toDate() : null,
    'doj': req.body.doj ? moment(req.body.doj).toDate() : moment().toDate(),
    'role': req.body.role || 'normal'
  });

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      if(err.errors && err.errors.hasOwnProperty('phone')) {
        res.status(400).send('Phone number should be unique');
      } else if(err.errors && err.errors.hasOwnProperty('email')) {
        res.status(400).send('Email ID should be unique');
      } else {
        res.status(err.status || 400).send('Unable to register, Please check your details');
      }
    });
};