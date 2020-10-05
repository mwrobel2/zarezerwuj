// login and signup routes

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const LoginData = require('../models/logindata');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const checkAuth = require('../middleware/check-auth');
const { ensureAuthenticated } = require('../middleware/ensureAuth');
const checkUserExists = require('../middleware/check-user-exists');

// CREATE NEW USER AND STORE IT IN DB
router.post('/signup', checkUserExists, ensureAuthenticated, (req, res, next) => {
  // I'm using a bcrypt to encrypt the password
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      login: req.body.login,
      email: req.body.email,
      department: req.body.department,
      name: req.body.name,
      surname: req.body.surname,
      password: hash,
      moduly: req.body.moduly,
      contractorFields: req.body.contractorFields,
      szkodliwaFields: req.body.szkodliwaFields,
      assortmentFields: req.body.assortmentFields,
      sekretariatFields: req.body.sekretariatFields,
      warehouseFields: req.body.warehouseFields,
      kluczeFields: req.body.kluczeFields,
      kluczeRejestrFields: req.body.kluczeRejestrFields,
      kluczeWydaniaFields: req.body.kluczeWydaniaFields,
      przesylkiFields: req.body.przesylkiFields
    });
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
});

// LIST USERS

// router.get('', checkAuth, (req, res, next) => {
  router.get('', ensureAuthenticated, (req, res, next) => {
  User.find().then(users => {
    // console.log(users);
    res.status(200).json({
      message: 'Users fetched successfully',
      users: users
    });
  });
});

// GET SINGLE USER

router.get('/:id', ensureAuthenticated, (req, res, next) => {
  // router.get('/:id', checkAuth, (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  });
});


// GET SINGLE USER BY login
router.get('/lg/:login', ensureAuthenticated, (req, res, next) => {
  User.findOne({ login: req.params.login }).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  });
});



// UPDATE USER

// router.put('/:id', checkAuth, (req, res, next) => {
  router.put('/:id', ensureAuthenticated, (req, res, next) => {
  // console.log('passwd: ', req.body.password);

  if (req.body.password !== null) {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new User({
        login: req.body.login,
        email: req.body.email,
        department: req.body.department,
        name: req.body.name,
        surname: req.body.surname,
        password: hash,
        moduly: req.body.moduly,
        contractorFields: req.body.contractorFields,
        szkodliwaFields: req.body.szkodliwaFields,
        assortmentFields: req.body.assortmentFields,
        sekretariatFields: req.body.sekretariatFields,
        warehouseFields: req.body.warehouseFields,
        kluczeFields: req.body.kluczeFields,
        kluczeRejestrFields: req.body.kluczeRejestrFields,
        kluczeWydaniaFields: req.body.kluczeWydaniaFields,
        przesylkiFields: req.body.przesylkiFields
      });
      // const user = new User(req.body);
      user._id = req.params.id;
      User.updateOne({ _id: req.params.id }, user).then(result => {
        // console.log(result);
        res.status(200).json({ message: 'User updated.' });
      });
    });
  } else {
    // console.log('haslo null');
    const user = new User({
      login: req.body.login,
      email: req.body.email,
      department: req.body.department,
      name: req.body.name,
      surname: req.body.surname,
      moduly: req.body.moduly,
      contractorFields: req.body.contractorFields,
      szkodliwaFields: req.body.szkodliwaFields,
      assortmentFields: req.body.assortmentFields,
      sekretariatFields: req.body.sekretariatFields,
      warehouseFields: req.body.warehouseFields,
      kluczeFields: req.body.kluczeFields,
      kluczeRejestrFields: req.body.kluczeRejestrFields,
      kluczeWydaniaFields: req.body.kluczeWydaniaFields,
      przesylkiFields: req.body.przesylkiFields
    });
    user._id = req.params.id;
    User.updateOne({ _id: req.params.id }, user).then(result => {
      // console.log(result);
      res.status(200).json({ message: 'User updated 2.' });
    });
  }

});

// DELETE USER

router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  // router.delete('/:id', checkAuth, (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(result => {
    // console.log(result);
    res.status(200).json({ message: 'User deleted' });
  });
});

// LOGIN USER
router.post('/login', (req, res, next) => {
  // here I store data about user
  let fetchedUser;
  let userLogin = req.body.login;
  User.findOne({ login: req.body.login })
    .then(user => {
      //If I'm here then the user with that login exists in db
      //If there is no such user then return message
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed.'
        });
      }
      fetchedUser = user;
      // Now I have to verify password
      // so I compare hashes from db and from the form
      // it returns new Promise
      return bcrypt.compare(req.body.password, user.password);
    })
    .catch(err => console.log('err', err))
    .then(result => {
      // here I get result of above comparision
      // it will be true if success and false if failed
      if (!result) {
        // loguję informację do bazy
        const loginDataBody = {
          login: fetchedUser.login,
          date: new Date(),
          message: 'Auth failed.'
        };
        const loginData = new LoginData(loginDataBody);
        loginData.save();
        return res.status(401).json({
          message: 'Auth failed.'
        });
      }
      // If we are here ther result of comparision was successfull
      // and here I cna create JWT (Json Web Token) which will be passed to the client
      // I'm creating a token based on userlogin and user._id
      const token = jwt.sign(
        {
          login: fetchedUser.login,
          userId: fetchedUser._id,
          name: fetchedUser.name,
          surname: fetchedUser.surname,
          email: fetchedUser.email
        },
        'mojsekret_to_jest_moj_tajny_sekret',
        { expiresIn: '10h' }
      );
      // I'm savind info about login to DB
      const loginDataBody = {
        login: fetchedUser.login,
        date: new Date(),
        message: 'Successful login'
      };
      const loginData = new LoginData(loginDataBody);
      loginData.save();

      // I'm sending the token to the frontend
      fetchedUser.password = null;
      // console.log(token, fetchedUser);
      res.status(200).json({
        token: token,
        expiresIn: '36000',
        user: fetchedUser
      });
    })
    .catch(err => {
      // loguję informację do bazy
      const loginDataBody = {
        login: userLogin,
        date: new Date(),
        message: 'Unsuccessful login.'
      };
      const loginData = new LoginData(loginDataBody);
      loginData.save().catch(err => console.log('err2', err));
    });
});

// LOGOUT USER

module.exports = router;
