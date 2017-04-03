/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  res.clearCookie('username');
  res.clearCookie('token');
  res.clearCookie('uuid');
  res.clearCookie('stored_key');
  res.clearCookie('jobName');
  res.clearCookie('apiName');
  res.clearCookie('apiID');
  return res.redirect('/login');
};
