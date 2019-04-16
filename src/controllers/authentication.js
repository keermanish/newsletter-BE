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
      'Unauthorized, Please contact with admin';

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
    'role': req.body.role || 'normal',
    'domain': req.body.domain,
    'skills': req.body.skills,
    'visa': req.body.visa,
    'otherVisa': req.body.otherVisa,
    'about': req.body.about
  });

  user.save()
    .then(savedUser => {
      if(!savedUser) {
        res.status(400).send('Unable to register, Please check your details');
      }
      return savedUser.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      if(err.message) {
        res.status(400).send(err.message.substring(err.message.lastIndexOf(':') + 1));
      } else {
        res.status(err.status || 400).send('Unable to register, Please check your details');
      }
    });
};