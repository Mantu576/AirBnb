module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    req.flash('error', 'Please login to continue');
    return res.redirect('/login');
  }
  if (!req.session.user) {
    req.flash('error', 'Authentication failed');
    return res.redirect('/login');
  }
  next();
};