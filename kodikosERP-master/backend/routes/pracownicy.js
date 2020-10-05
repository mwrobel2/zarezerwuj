const express = require('express');
const router = express.Router();
const Pracownicy = require('../models/pracownicy');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING A PRACOWNICY
router.post('', ensureAuthenticated, (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const pracownicyBody = req.body;
  pracownicyBody.addBy = {};
  pracownicyBody.modBy = {};
  pracownicyBody.addDate = new Date();
  pracownicyBody.modDate = pracownicyBody.addDate;

  pracownicyBody.addBy.login = req.user.login;
  pracownicyBody.addBy.name = req.user.name;
  pracownicyBody.addBy.surname = req.user.surname;
  pracownicyBody.addBy.email = req.user.email;
  pracownicyBody.modBy.login = req.user.login;
  pracownicyBody.modBy.name = req.user.name;
  pracownicyBody.modBy.surname = req.user.surname;
  pracownicyBody.modBy.email = req.user.email;
  pracownicyBody.accountManager = req.user.name + ' ' + req.user.surname;
  pracownicyBody.accountManagerLogin = req.user.login;

  const pracownicy = new Pracownicy(pracownicyBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli pracownicys
  pracownicy.save().then(createdPracownicy => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Pracownicy added successfully.',
      pracownicyId: createdPracownicy._id,
    });
  });
});



// UPDATE PRACOWNICY
// I can use put or patch
router.put('/:id', ensureAuthenticated, (req, res, next) => {
  // I'm creating a new pracownicy object to store it in database
  const pracownicy = new Pracownicy(req.body);
  pracownicy.modBy = {};
  pracownicy.modDate = new Date();
  pracownicy.modBy.login = req.user.login;
  pracownicy.modBy.name = req.user.name;
  pracownicy.modBy.surname = req.user.surname;
  pracownicy.modBy.email = req.user.email;
  // because with new Pracownicy a new _id is crated I have to
  // set _id to the old value in other case update will fail
  pracownicy._id = req.params.id;
  Pracownicy.updateOne({ _id: req.params.id }, pracownicy).then(result => {
    res.status(200).json({ message: 'Pracownicy updated.' });
  });
});



// READING ALL PRACOWNICYS
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.name;
  const surname = req.query.surname;
  const accountManagerLogin = req.query.accountManagerLogin;
  const pracownicyname = req.query.pracownicyname;
  const departament = req.query.departament;
  const email = req.query.email;
  let pracownicysQuery = '';
  let findStr = '';
  let selector = {};

  // name - search
  if (fname != null) {
    findStr = `.*${fname}`;

    const words = fname.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.name = { $regex: findStr, $options: "i" };
  }

  // surname - search
  if (surname != null) {
    findStr = `.*${surname}`;
    const words = surname.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.surname = { $regex: findStr, $options: "i" };
  }

  // email - search
  if (email != null) {
    findStr = `.*${email}`;
    const words = email.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.email = { $regex: findStr, $options: "i" };
  }

  // departament - search
  if (departament != null) {
    findStr = `.*${departament}`;
    const words = departament.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.departament = { $regex: findStr, $options: "i" };
  }


  // accountManagerLogin - search
  if (accountManagerLogin != null) {
    selector.accountManagerLogin = `${accountManagerLogin}`;
  }


  pracownicysQuery = Pracownicy.find(selector).sort({ "modDate": -1 });

  let fetchedPracownicys;
  if (pageSize && currentPage) {
    pracownicysQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  pracownicysQuery.then(documents => {
    fetchedPracownicys = documents;

    //zwracam liczbę dokumentow
    if (fname != null) {
      return Object.keys(documents).length;
    } else {
      return Pracownicy.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'Pracownicys fetched successfully',
        pracownicys: fetchedPracownicys,
        maxPracownicys: count,
      });
    });
});

// GET SINGLE PRACOWNICY
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  Pracownicy.findById(req.params.id).then(pracownicy => {
    if (pracownicy) {
      res.status(200).json({ pracownicy: pracownicy });
    } else {
      res.status(404).json({ message: 'Pracownicy not found.' });
    }
  });
});

// GET PRACOWNICYS BY TYPE
router.get('/type/:pracType', ensureAuthenticated, (req, res, next) => {
  Pracownicy.find({ rodzajTowaru: req.params.pracType }).then(documents => {
    res.status(200).json({
      message: 'Pracownicys fetched successfully',
      pracownicys: documents
    });
  });
});

// DELETEING A PRACOWNICY
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Pracownicy.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Pracownicy deleted' });
  });
});

module.exports = router;
