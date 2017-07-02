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