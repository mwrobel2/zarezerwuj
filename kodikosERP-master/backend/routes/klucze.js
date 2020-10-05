const express = require('express');
const router = express.Router();
const Klucze = require('../models/klucze');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING KLUCZE
router.post('', ensureAuthenticated,   (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const kluczeBody = req.body;
  kluczeBody.addBy = {};
  kluczeBody.modBy = {};
  kluczeBody.addDate = new Date();
  kluczeBody.modDate = kluczeBody.addDate;

  kluczeBody.addBy.login = req.user.login;
  kluczeBody.addBy.name = req.user.name;
  kluczeBody.addBy.surname = req.user.surname;
  kluczeBody.addBy.email = req.user.email;
  kluczeBody.modBy.login = req.user.login;
  kluczeBody.modBy.name = req.user.name;
  kluczeBody.modBy.surname = req.user.surname;
  kluczeBody.modBy.email = req.user.email;
  kluczeBody.accountManager = req.user.name + ' ' + req.user.surname;
  kluczeBody.accountManagerLogin = req.user.login;

  const klucze = new Klucze(kluczeBody);
  klucze.save().then(createdKlucze => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Klucze added successfully.',
      kluczeId: createdKlucze._id,
    });
  });
});



// UPDATE KLUCZE
// I can use put or patch
router.put('/:id', ensureAuthenticated,(req, res, next) => {
  // I'm creating a new klucze object to store it in database
  const klucze = new Klucze(req.body);
  klucze.modDate = new Date();
  klucze.modBy.login = req.user.login;
  klucze.modBy.name = req.user.name;
  klucze.modBy.surname = req.user.surname;
  klucze.modBy.email = req.user.email;
  // because with new Klucze a new _id is crated I have to
  // set _id to the old value in other case update will fail
  klucze._id = req.params.id;
  Klucze.updateOne({ _id: req.params.id }, klucze).then(result => {
    res.status(200).json({ message: 'Klucze updated.' });
  });
});



// READING ALL KLUCZE
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.fname;
  const imie = req.query.imie;
  const nazwisko = req.query.nazwisko;
  const zaklad = req.query.zaklad;
  const nrKarty = req.query.nrKarty;
  const accountManagerLogin = req.query.accountManagerLogin;
  let kluczeQuery = '';
  let findStr = '';
  let selector = {};

  // fullName - search
  if (fname != null) {
    findStr = `.*${fname}`;

    const words = fname.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.fullName = { $regex: findStr, $options: "i" };
    // kluzeQuery = Klucze.find(selector);
  }

  // accountManagerLogin - search
  if (accountManagerLogin != null) {
    selector.accountManagerLogin = `${accountManagerLogin}`;
  }

  // imie - search
  if (imie != null) {
    findStr = `.*${imie}`;
    const words = imie.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.imie = { $regex: findStr, $options: "i" };
  }

  // nazwisko - search
  if (nazwisko != null) {
    findStr = `.*${nazwisko}`;
    const words = nazwisko.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.nazwisko = { $regex: findStr, $options: "i" };
  }

  // zaklad - search
  if (zaklad != null) {
    findStr = `.*${zaklad}`;
    const words = zaklad.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.zaklad = { $regex: findStr, $options: "i" };
  }


  // nrKarty - search
  if (nrKarty != null) {
    findStr = `.*${nrKarty}`;
    const words = nrKarty.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.nrKarty = { $regex: findStr, $options: "i" };
  }

  kluczeQuery = Klucze.find(selector).sort({ "modDate": -1 });

  let fetchedKlucze;
  if (pageSize && currentPage) {
    kluczeQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  kluczeQuery.then(documents => {
    fetchedKlucze = documents;

    //zwracam liczbę dokumentow
    if (fname != null) {
      return Object.keys(documents).length;
    } else {
      return Klucze.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'Klucze fetched successfully',
        klucze: fetchedKlucze,
        maxKlucze: count,
      });
    });
});

// GET SINGLE KLUCZE
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  Klucze.findById(req.params.id).then(klucze => {
    if (klucze) {
      res.status(200).json({ klucze: klucze });
    } else {
      res.status(404).json({ message: 'Klucze not found.' });
    }
  });
});

// GET KLUCZE BY TYPE
router.get('/type/:assortType', ensureAuthenticated, (req, res, next) => {
  Klucze.find({ rodzajTowaru: req.params.kluczeType }).then(documents => {
    res.status(200).json({
      message: 'Klucze fetched successfully',
      klucze: documents
    });
  });
});

// DELETEING KLUCZE
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Klucze.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Klucze deleted' });
  });
});

module.exports = router;
