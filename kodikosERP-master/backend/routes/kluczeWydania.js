const express = require('express');
const router = express.Router();
const KluczeWydania = require('../models/kluczewydania');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING KLUCZEWYDANIA
router.post('', ensureAuthenticated,   (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const kluczeWydaniaBody = req.body;
  kluczeWydaniaBody.addBy = {};
  kluczeWydaniaBody.modBy = {};
  kluczeWydaniaBody.addDate = new Date();
  kluczeWydaniaBody.modDate = kluczeWydaniaBody.addDate;

  kluczeWydaniaBody.addBy.login = req.user.login;
  kluczeWydaniaBody.addBy.name = req.user.name;
  kluczeWydaniaBody.addBy.surname = req.user.surname;
  kluczeWydaniaBody.addBy.email = req.user.email;
  kluczeWydaniaBody.modBy.login = req.user.login;
  kluczeWydaniaBody.modBy.name = req.user.name;
  kluczeWydaniaBody.modBy.surname = req.user.surname;
  kluczeWydaniaBody.modBy.email = req.user.email;
  kluczeWydaniaBody.accountManager = req.user.name + ' ' + req.user.surname;
  kluczeWydaniaBody.accountManagerLogin = req.user.login;

  const kluczeWydania = new KluczeWydania(kluczeWydaniaBody);
  kluczeWydania.save().then(createdKluczeWydania => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'KluczeWydania added successfully.',
      kluczeWydaniaId: createdKluczeWydania._id,
    });
  });
});



// UPDATE KLUCZEWYDANIA
// I can use put or patch
router.put('/:id', ensureAuthenticated,(req, res, next) => {
  // I'm creating a new kluczewydania object to store it in database
  const kluczeWydania = new KluczeWydania(req.body);
  kluczeWydania.modDate = new Date();
  kluczeWydania.modBy.login = req.user.login;
  kluczeWydania.modBy.name = req.user.name;
  kluczeWydania.modBy.surname = req.user.surname;
  kluczeWydania.modBy.email = req.user.email;
  // because with new KluczeWydania a new _id is crated I have to
  // set _id to the old value in other case update will fail
  kluczeWydania._id = req.params.id;
  KluczeWydania.updateOne({ _id: req.params.id }, kluczeWydania).then(result => {
    res.status(200).json({ message: 'KluczeWydania updated.' });
  });
});



// READING ALL KLUCZEWYDANIA
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const numerKlucza = req.query.numerKlucza;
  const rfidKlucza = req.query.rfidKlucza;
  const imie = req.query.imie;
  const nazwisko = req.query.nazwisko;
  const dzial = req.query.dzial;
  const operacja = req.query.operacja;
  const dataWydania = req.query.dataWydania;
  const accountManagerLogin = req.query.accountManagerLogin;
  let kluczeWydaniaQuery = '';
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


  // dzial - search
  if (dzial != null) {
    findStr = `.*${dzial}`;
    const words = dzial.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.dzial = { $regex: findStr, $options: "i" };
  }

  // operacja - search
  if (operacja != null) {
    findStr = `.*${operacja}`;
    const words = operacja.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.operacja = { $regex: findStr, $options: "i" };
  }


  // dataWydania - search
  if (dataWydania != null) {
    findStr = `.*${dataWydania}`;
    const words = dataWydania.split(' ');
    if (words.length > 1) {
      findStr = '';
      for (let word of words) {
        findStr += `(?=.*${word})`;
      }
    }
    selector.dataWydania = { $regex: findStr, $options: "i" };
  }

  kluczeWydaniaQuery = KluczeWydania.find(selector).sort({ "modDate": -1 });

  let fetchedKluczeWydania;
  if (pageSize && currentPage) {
    kluczeWydaniaQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  kluczeWydaniaQuery.then(documents => {
    fetchedKluczeWydania = documents;

    //zwracam liczbę dokumentow
    if (numerKlucza != null) {
      return Object.keys(documents).length;
    } else {
      return KluczeWydania.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'KluczeWydania fetched successfully',
        kluczeWydania: fetchedKluczeWydania,
        maxKluczeWydania: count,
      });
    });
});

// GET SINGLE KLUCZEWYDANIA
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  KluczeWydania.findById(req.params.id).then(kluczeWydania => {
    if (kluczeWydania) {
      res.status(200).json({ kluczeWydania: kluczeWydania });
    } else {
      res.status(404).json({ message: 'KluczeWydania not found.' });
    }
  });
});

// DELETEING KLUCZE
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  KluczeWydania.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'KluczeWydania deleted' });
  });
});

module.exports = router;
