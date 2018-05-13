import User from '../models/user';

/**
 * a middleware to find user info based on token passed
 * if user is present then call next routes
 */
export const isAuthorizedUser = (req, res, next) => {
  const token = req.header('x-auth');

  console.log('token', token);

  User.findUserByToken(token)
    .then(user => {
      console.log('user', user);

      if(!user) {
        return Promise.reject({'status': 401});
      }

      req.user = user;
      req.token = token;

      next();
    })
    .catch(err => {
      res.status(401).send('Unauthorized, Please login', err);
    });
};
