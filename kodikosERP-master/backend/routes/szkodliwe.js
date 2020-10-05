const express = require('express');
const router = express.Router();
const Szkodliwa = require('../models/szkodliwa');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING SZKODLIWA
router.post('', ensureAuthenticated, (req, res, next) => {
  // url info
  const url = req.protocol + '://' + req.get('host') + '/';
  const szkodlwaBody = req.body;
  szkodlwaBody.addBy = {};
  szkodlwaBody.modBy = {};
  szkodlwaBody.addDate = new Date();
  szkodlwaBody.modDate = szkodlwaBody.addDate;

  szkodlwaBody.addBy.login = req.user.login;
  szkodlwaBody.addBy.name = req.user.name;
  szkodlwaBody.addBy.surname = req.user.surname;
  szkodlwaBody.addBy.email = req.user.email;
  szkodlwaBody.modBy.login = req.user.login;
  szkodlwaBody.modBy.name = req.user.name;
  szkodlwaBody.modBy.surname = req.user.surname;
  szkodlwaBody.modBy.email = req.user.email;
  szkodlwaBody.accountManager = req.user.name + ' ' + req.user.surname;
  szkodlwaBody.accountManagerLogin = req.user.login;

  const szkodliwa = new Szkodliwa(szkodlwaBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli szkodliwas
  szkodliwa.save().then(createdSzkodliwa => {
    res.status(201).json({
      message: 'Szkodliwa added successfully.',
      szkodliwaId: createdSzkodliwa._id,
    });
  });
});



// UPDATE SZKODLIWA
// I can use put or patch
router.put('/:id', ensureAuthenticated, (req, res, next) => {
  // I'm creating a new szkodliwa object to store it in database
  const szkodliwa = new Szkodliwa(req.body);
  szkodliwa.modDate = new Date();
  szkodliwa.modBy.login = req.user.login;
  szkodliwa.modBy.name = req.user.name;
  szkodliwa.modBy.surname = req.user.surname;
  szkodliwa.modBy.email = req.user.email;
  // because with new Szkodliwa a new _id is crated I have to
  // set _id to the old value in other case update will fail
  szkodliwa._id = req.params.id;
  Szkodliwa.updateOne({ _id: req.params.id }, szkodliwa).then(result => {
    res.status(200).json({ message: 'Szkodliwa updated.' });
  });
});



// READING ALL SZKODLIWE
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.fname;
  const name = req.query.name;
  const accountManagerLogin = req.query.accountManagerLogin;
  const comments = req.query.comments;
  const zaklad = req.query.zaklad;
  const sur = req.query.sur;
  const zagr = req.query.zagr;
  const rok = req.query.rok;
  let szkodliweQuery = '';
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
  }

  // accountManagerLogin - search
  // MUSI ZOSTAĆ PO TYM WYSZUKIWANIA SWOJE/NIE SWOJE
  if (accountManagerLogin != null) {
    selector.accountManagerLogin = `${accountManagerLogin}`;
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

  //zaklad - search
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

  // rok - search
  if (rok != null) {
    rokNumber = Number(rok);
    selector.rok = rokNumber ;
  }

  //surname - search
  if (sur != null) {
    findStr = `.*${sur}`;
    selector['addBy.surname'] = { $regex: findStr, $options: "i" };
  }

  //zagrożenie (rodzaj) - search
  if (zagr != null) {
    findStr = `.*${zagr}`;
    selector.rodzajeZagrozen = {$elemMatch: { zagrozenie: { $regex: findStr, $options: "i"} }};
  }

  szkodliweQuery = Szkodliwa.find(selector).sort({ "modDate": -1 });

  // szkodliweQuery = Szkodliwa.find({'addBy.surname':'Seń'}).sort({ "modDate": -1 });
  // console.log(selector);

  let fetchedSzkodliwe;
  if (pageSize && currentPage) {
    szkodliweQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  szkodliweQuery.then(documents => {
    fetchedSzkodliwe = documents;

    //zwracam liczbę dokumentow
    if (fname != null) {
      return Object.keys(documents).length;
    } else {
      return Szkodliwa.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'Szkodliwe fetched successfully',
        szkodliwe: fetchedSzkodliwe,
        maxSzkodliwe: count,
      });
    });
});

// GET SINGLE SZKODLIWA
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  Szkodliwa.findById(req.params.id).then(szkodliwa => {
    if (szkodliwa) {
      res.status(200).json({ szkodliwa: szkodliwa });
    } else {
      res.status(404).json({ message: 'Szkodliwa not found.' });
    }
  });
});

// GET SZKODLIWE BY TYPE
router.get('/type/:szkodType', ensureAuthenticated, (req, res, next) => {
  Szkodliwa.find({ szkodType: req.params.szkodType }).then(documents => {
    res.status(200).json({
      message: 'Szkodliwe fetched successfully',
      szkodliwe: documents
    });
  });
});

// DELETEING SZKODLIWA
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Szkodliwa.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Szkodliwa deleted' });
  });
});

module.exports = router;
