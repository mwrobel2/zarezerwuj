const express = require('express');
const router = express.Router();
const LoginData = require('../models/logindata');
const checkAuth = require('../middleware/check-auth');

// READING ALL LOGIN DATA
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', checkAuth, (req, res, next) => {
  // zwracam napis
  // res.send('Hello from express');

  // I'm getting data from the database
  LoginData.find().then(documents => {
    // console.log(documents);
    //zwracam json data
    res.status(200).json({
      message: 'Login datas fetched successfully',
      loginDatas: documents
    });
  });
});

// GET SINGLE LOGIN DATA
router.get('/:id', checkAuth, (req, res, next) => {
  LoginData.findById(req.params.id).then(loginData => {
    if (loginData) {
      res.status(200).json(loginData);
    } else {
      res.status(404).json({ message: 'Login data not found.' });
    }
  });
});

module.exports = router;
