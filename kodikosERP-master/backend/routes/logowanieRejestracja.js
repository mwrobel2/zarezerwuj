const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const checkUserExists = require('../middleware/check-user-exists');
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

var opts = { failWithError: true };

// zarejestrowanie nowego usera w bazie
router.post('/register', ensureAuthenticated, checkUserExists, function (req, res, next) {
  const user = new User({
    login: req.body.login,
    email: req.body.email,
    department: req.body.department,
    name: req.body.name,
    surname: req.body.surname,
    password: User.hashPassword(req.body.password),
    moduly: req.body.moduly,
    contractorFields: req.body.contractorFields
  });
  // zapisuję usera do bazy
  user
    .save()
    .then(result => {
      res.status(201).json({
        message: 'User created.',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


// logowanie użytkownika do MongoDB
router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); }
    req.logIn(user, function(err) {
      // if (err) { return res.status(501).json(err); }
      if (err) { return res.status(501).json({message: 'Nieudane logowanie.'}); }
      return res.status(200).json({message: 'Zalogowany.'});
    });
  })(req, res, next);
});

// Logowanie active directory
router.post('/login2', passport.authenticate('ActiveDirectory', opts), function(req, res) {
  // res.json(req.user);
  res.status(200).json({message: 'Zalogowany.'});
}, function (err) {
  res.status(401).send('Not Authenticated');
});


// porbranie informacji o użytkowniku
router.get('/login', ensureAuthenticated, function(req, res, next) {
  req.user.password = '';
  req.user._id = null;
  return res.status(200).json(req.user);
});

// wylogowanie usera
router.get('/logout', ensureAuthenticated, function(req,res,next){
  req.logout();
  return res.status(200).json({message:'Logout Success'});
});



module.exports = router;
