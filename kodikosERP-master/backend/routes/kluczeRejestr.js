const express = require('express');
const router = express.Router();
const KluczeRejestr = require('../models/kluczerejestr');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING KLUCZEREJESTR
router.post('', ensureAuthenticated,   (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const kluczeRejestrBody = req.body;
  kluczeRejestrBody.addBy = {};
  kluczeRejestrBody.modBy = {};
  kluczeRejestrBody.addDate = new Date();
  kluczeRejestrBody.modDate = kluczeRejestrBody.addDate;

  kluczeRejestrBody.addBy.login = req.user.login;
  kluczeRejestrBody.addBy.name = req.user.name;
  kluczeRejestrBody.addBy.surname = req.user.surname;
  kluczeRejestrBody.addBy.email = req.user.email;
  kluczeRejestrBody.modBy.login = req.user.login;
  kluczeRejestrBody.modBy.name = req.user.name;
  kluczeRejestrBody.modBy.surname = req.user.surname;
  kluczeRejestrBody.modBy.email = req.user.email;
  kluczeRejestrBody.accountManager = req.user.name + ' ' + req.user.surname;
  kluczeRejestrBody.accountManagerLogin = req.user.login;

  const kluczeRejestr = new KluczeRejestr(kluczeRejestrBody);
  kluczeRejestr.save().then(createdKluczeRejestr => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'KluczeRejestr added successfully.',
      kluczeRejestrId: createdKluczeRejestr._id,
    });
  });
});



// UPDATE KLUCZEREJESTR
// I can use put or patch
router.put('/:id', ensureAuthenticated,(req, res, next) => {
  // I'm creating a new kluczerejestr object to store it in database
  const kluczeRejestr = new KluczeRejestr(req.body);
  kluczeRejestr.modDate = new Date();
  kluczeRejestr.modBy.login = req.user.login;
  kluczeRejestr.modBy.name = req.user.name;
  kluczeRejestr.modBy.surname = req.user.surname;
  kluczeRejestr.modBy.email = req.user.email;
  // because with new KluczeRejestr a new _id is crated I have to
  // set _id to the old value in other case update will fail
  kluczeRejestr._id = req.params.id;
  KluczeRejestr.updateOne({ _id: req.params.id }, kluczeRejestr).then(result => {
    res.status(200).json({ message: 'KluczeRejestr updated.' });
  });
});



// READING ALL KLUCZEREJESTR
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const numerKlucza = req.query.numerKlucza;
  const rfidKlucza = req.query.rfidKlucza;
  const comments = req.query.comments;
  const accountManagerLogin = req.query.accountManagerLogin;
  let kluczeRejestrQuery = '';
  let findStr = '';
  let selector = {};

  // fullName - search
  if (numerKlucza != null) {
    findStr = `.*${numerKlucza}`;

    const words = numerKlucza.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.numerKlucza = { $regex: findStr, $options: "i" };
    // kluzeQuery = Klucze.find(selector);
  }

  // accountManagerLogin - search
  if (accountManagerLogin != null) {
    selector.accountManagerLogin = `${accountManagerLogin}`;
  }

  // rfidKlucza - search
  if (rfidKlucza != null) {
    findStr = `.*${rfidKlucza}`;
    const words = rfidKlucza.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.rfidKlucza = { $regex: findStr, $options: "i" };
  }

  // comments - search
  if (comments != null) {
    findStr = `.*${comments}`;
    const words = comments.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.comments = { $regex: findStr, $options: "i" };
  }

  kluczeRejestrQuery = KluczeRejestr.find(selector).sort({ "modDate": -1 });

  let fetchedKluczeRejestr;
  if (pageSize && currentPage) {
    kluczeRejestrQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  kluczeRejestrQuery.then(documents => {
    fetchedKluczeRejestr = documents;

    //zwracam liczbę dokumentow
    if (numerKlucza != null) {
      return Object.keys(documents).length;
    } else {
      return KluczeRejestr.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'KluczeRejestr fetched successfully',
        kluczeRejestr: fetchedKluczeRejestr,
        maxKluczeRejestr: count,
      });
    });
});

// GET SINGLE KLUCZEREJESTR
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  console.log('BCK ID:', req.params.id);
  KluczeRejestr.findById(req.params.id).then(kluczeRejestr => {
    if (kluczeRejestr) {
      res.status(200).json({ kluczeRejestr: kluczeRejestr });
    } else {
      res.status(404).json({ message: 'KluczeRejestr not found.' });
    }
  })
  .catch((err) => {
    // console.log('KLUCZ REJESTER ID NOT FOUND.');
    res.status(200).json({ message: 'kluczeRejestr ID not found'});
    // res.status(404).json({ message: 'KluczeRejestr ID not found.' });
  });
});

// GET SINGLE KLUCZEREJESTR BY RFID
// router.get('/:rfid', ensureAuthenticated, (req, res, next) => {
//   console.log('BCK ID:', req.params.rfid);
//   KluczeRejestr.findById(req.params.id).then(kluczeRejestr => {
//     if (kluczeRejestr) {
//       res.status(200).json({ kluczeRejestr: kluczeRejestr });
//     } else {
//       res.status(404).json({ message: 'KluczeRejestr not found.' });
//     }
//   });
// });

// DELETEING KLUCZE
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  KluczeRejestr.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'KluczeRejestr deleted' });
  });
});

module.exports = router;
