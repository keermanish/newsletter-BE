import User from '../models/user';

/**
 * a middleware to find user info based on token passed
 * if user is present then call next routes 
 */
export const isAuthorizedUser = (req, res, next) => {
  const token = req.header('x-auth');

  User.findUserByToken(token)
    .then(user => {
      if(!user) {
        return Promise.reject({'status': 401});
      }

      req.user = user;
      req.token = token;

      next();
    })
    .catch(err => {
      res.status(401).send('Unauthorized, Please login');
    });
};

/**
 * middleware to verify user info against database
 * specifically user status
 * this middleware must pass through isAuthorizedUser,
 * since we are not doing token check here, also middleware expect user infor in req
 */
export const verifyAgainstDB = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if(user && user.status !== 'active' || !user) {
        return Promise.reject({'status': 401});
      }

      next();
    })
    .catch(err => {
      res.status(401).send('Unauthorized, Please login');
    });
};