import fs from 'fs';
import path from 'path';

import User from '../models/user';

/**
 * controller to get user info
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