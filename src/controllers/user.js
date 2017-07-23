import fs from 'fs';
import path from 'path';

import User from '../models/user';

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
        'avatar': `/uploads/avatar/${req.file.filename}`
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
      res.status(400).send(err);
    });
};

/**
 * controller to update user information
 * pass whatever you want update (it should be part of user schema)
 * PUT /user/:id
 */
export const updateUser = (req, res) => {
  const userID = req.params.id;
  const userUpdatedDate = req.body;

  User.findByIdAndUpdate(userID, {
      '$set': userUpdatedDate
    }, {
      'new': true
    })
    .then(user => {
      if(!user) {
        return Promise.reject({'status': 401});
      }

      res.status(200).send(user);
    })
    .catch(err => {
      res.status(err.status || 400).send(err);
    });
};
