import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import User from '../models/user';
import config from '../config/config';
import redisClient from '../config/redis';
import { hashData } from '../helpers/encryption';

/**
 * controller to get current user info
 * GET /user/me
 */
export const getUser = (req, res) => {

  /**
   * since everything already been done through middleware
   * check isAuthorized middleware which finds the user info based on token
   * and assign it to req object
   */
  res.send(req.user);
};

/**
 * controller to get specific users info
 * GET /user/:id
 */
export const getUserByID = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if(!user) {
        return Promise.reject({'status': 404});
      }

      res.status(200).send(user);
    })
    .catch(err => {
      res.status(err.status || 400).send();
    });
};

/**
 * controller to get list of user
 * GET /user/list/:status [all, pending, active]
 */
export const getUserList = (req, res) => {
  const filter = req.params.status === 'all' ? {} : {
    'status': req.params.status
  };

  User.find(filter)
    .then(list => {
      if(!list) {
        return Promise.reject({'status': 404});
      }

      res.status(200).send(list);
    })
    .catch(err => {
      res.status(err.status || 400).send();
    });
};

/**
 * controller to set user avatar/profile pic
 * once image store successfully then delete previous avatar
 * POST /user/avatar
 */
export const setAvatar = (req, res) => {
  const oldAvatarPath = req.user.avatar;

  User.findByIdAndUpdate(req.user._id, {
      '$set': {
        'avatar': `${config.API_URL}/uploads/avatar/${req.file.filename}`
      }
    }, {
      'new': true
    })
    .then(user => {

      /* check for old avatar */
      if(oldAvatarPath) {
        fs.unlink(path.join(__dirname, './../../', oldAvatarPath));
      }

      res.send(user);
    })
    .catch(err => {
      res.status(400).send('Unable to set profile pic, Please try again');
    });
};

/**
 * controller to update user information
 * pass whatever you want update (it should be part of user schema)
 * PUT /user/:id
 */
export const updateUser = (req, res) => {
  const userID = req.params.id;
  const userDataToBeUpdated = _.omit(req.body, ['_id']);

  const password = userDataToBeUpdated.credentials ? userDataToBeUpdated.credentials.password : null;

  hashData(password)
    .then(hashedPassword => {
      return new Promise((resolve, reject) => {
        if(hashedPassword) {
          userDataToBeUpdated.password = hashedPassword;
        }

        if(userDataToBeUpdated.status && userDataToBeUpdated.status !== 'active') {
          /* for key operations we need to add prefix manually */
          // redisClient.del(`auth:${userID}`, (err) => {
          //   resolve();
          // });

          resolve();
        } else {
          resolve();
        }
      });
    })
    .then(() => {
      return User.findByIdAndUpdate(userID, {
        '$set': userDataToBeUpdated
      }, {
        'new': true,
        'runValidators': true,
        'context': 'query'
      });
    })
    .then(user => {
      if(!user) {
        return Promise.reject({'status': 401});
      }

      res.status(200).send(user);
    })
    .catch(err => {
      if(err.message) {
        res.status(400).send(err.message.substring(err.message.lastIndexOf(':') + 1));
      } else {
        res.status(err.status || 400).send('Unable to register, Please check your details');
      }
    });
};

/**
 * controller to logout current user
 * DELETE /user/logout
 */
export const logoutCurrentUser = (req, res) => {
  const token = req.header('x-auth');

  // redisClient.srem(`auth:${req.user._id}`, [token], err => {
  //   if(err) {
  //     res.status(400).send('Unable to logout');
  //   }

  //   res.status(200).send();
  // });

  res.status(200).send();
};
