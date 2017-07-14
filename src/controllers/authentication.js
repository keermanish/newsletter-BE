import express from 'express';

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
      res.status(err.status || 404).send(err);
    });
};

/**
 * controller for create user
 * POST /user/create (default role: normal)
 */
export const createUser = (req, res) => {
  var user = new User({
    'fname': req.body.name.fname,
    'lname': req.body.name.lname,
    'email': req.body.email,
    'phone': req.body.phone,
    'designation': req.body.designation,
    'password': req.body.credentials.password,
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
      res.status(err.status || 400).send(err);
    });
};