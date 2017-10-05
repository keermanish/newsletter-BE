import path from 'path';

import User from '../models/user';

/**
 * controller to get uploaded files/images
 * GET /uploads/:type (avatar)/:file (file name)
 */
export const getUploadedFiles = (req, res) => {
  if(req.params.type && req.params.file) {
    res.sendFile(path.join(__dirname, './../../uploads', req.params.type, req.params.file));
  } else {
    res.status(404).send('No such file or directory');
  }
};

/**
 * controller to send forgot password link
 * POST /forgot-password
 * required email
 */
export const sendOTPLink = (req, res) => {
  const email = req.body.email;

  if(!email) {
    return res.status(400).send('Please provide email ID');
  }

  User.findOne({ email })
    .then(user => {
      if(!user) {
        return Promise.reject({'status': 404});
      }

      return user.generateOTP();
    })
    .then(user => {
      res.status(200).send({
        'otp': user.otp,
        'userID': user._id
      });
    })
    .catch(err => {
      const errCode = err && err.status ? err.status : 400;
      const errMsg = errCode === 404 ?
                    'No such user registered' :
                    'Error while sending reset password link, Please try again';

      res.status(errCode).send(errMsg);
    });
};

/**
 * controller to reset the password
 * POST /reset-password
 * required otp, userID, password
 */
export const resetPassword = (req, res) => {
  const userID = req.body.userID;
  const otp = req.body.otp;
  const password = req.body.password;

  if(!userID || !otp || !password) {
    return res.status(400).send('Unable to reset password, Please provide required data');
  }

  User.findById(userID)
    .then(user => {
      if(!user) {
        return Promise.reject({'status': 404});
      }

      return user.verifyOTPAndResetPassword(otp, password);
    })
    .then(user => {
      res.status(200).send('Password has been reset successfully');
    })
    .catch(err => {
      const errCode = err && err.status ? err.status : 400;
      const errMsg = errCode === 404 ?
                    'No such user registered' :
                    'Reset password link has expired, Please try again';

      res.status(errCode).send(errMsg);
    });

};