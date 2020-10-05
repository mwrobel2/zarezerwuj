module.exports = {
  ensureAuthenticated: function(req, res, next) {
    // console.log('isAuth ', req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    } else {
    return res.status(401).json({message: 'Unauthorized Request'});
    }
  }
  // forwardAuthenticated: function(req, res, next) {
  //   if (!req.isAuthenticated()) {
  //     return next();
  //   }
  //   res.redirect('/dashboard');
  // }
};
