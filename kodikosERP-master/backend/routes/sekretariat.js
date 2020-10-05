const express = require('express');
const router = express.Router();
const Sekretariat = require('../models/sekretariat');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING AN OFFICE DOCUMENT
router.post('', ensureAuthenticated,   (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const sekretariatBody = req.body;
  sekretariatBody.addBy = {};
  sekretariatBody.modBy = {};
  sekretariatBody.addDate = new Date();
  sekretariatBody.modDate = sekretariatBody.addDate;
  sekretariatBody.addBy.login = req.user.login;
  sekretariatBody.addBy.name = req.user.name;
  sekretariatBody.addBy.surname = req.user.surname;
  sekretariatBody.addBy.email = req.user.email;
  sekretariatBody.modBy.login = req.user.login;
  sekretariatBody.modBy.name = req.user.name;
  sekretariatBody.modBy.surname = req.user.surname;
  sekretariatBody.modBy.email = req.user.email;
  sekretariatBody.accountManager = req.user.name + ' ' + req.user.surname;
  sekretariatBody.accountManagerLogin = req.user.login;

  const sekretariat = new Sekretariat(sekretariatBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli sekretariats
  sekretariat.save().then(createdSekretariat => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Sekretariat added successfully.',
      sekretariatId: createdSekretariat._id,
    });
  });
});



// UPDATE AN SEKRETARIAT
// I can use put or patch
router.put('/:id', ensureAuthenticated,(req, res, next) => {
  // I'm creating a new sekretariat object to store it in database
  const sekretariat = new Sekretariat(req.body);
  sekretariat.modDate = new Date();
  sekretariat.modBy.login = req.user.login;
  sekretariat.modBy.name = req.user.name;
  sekretariat.modBy.surname = req.user.surname;
  sekretariat.modBy.email = req.user.email;
  // because with new Sekretariat a new _id is crated I have to
  // set _id to the old value in other case update will fail
  sekretariat._id = req.params.id;
  Sekretariat.updateOne({ _id: req.params.id }, sekretariat).then(result => {
    res.status(200).json({ message: 'Sekretariat updated.' });
  });
});



// READING ALL SEKRETARIAT DOCS
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.fname;
  const name = req.query.name;
  const accountManagerLogin = req.query.accountManagerLogin;
  const comments = req.query.comments;
  let sekretariatsQuery = '';
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

  sekretariatsQuery = Sekretariat.find(selector).sort({ "modDate": -1 });

  let fetchedSekretariats;
  if (pageSize && currentPage) {
    sekretariatsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  sekretariatsQuery.then(documents => {
    fetchedSekretariats = documents;

    //zwracam liczbę dokumentow
    if (fname != null) {
      return Object.keys(documents).length;
    } else {
      return Sekretariat.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'Sekretariats fetched successfully',
        sekretariats: fetchedSekretariats,
        maxSekretariats: count,
      });
    });
});

// GET SINGLE SEKRETARIAT
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  Sekretariat.findById(req.params.id).then(sekretariat => {
    if (sekretariat) {
      res.status(200).json({ sekretariat: sekretariat });
    } else {
      res.status(404).json({ message: 'Sekretariat not found.' });
    }
  });
});

// GET SEKRETARIATS BY TYPE
router.get('/type/:sekretrType', ensureAuthenticated, (req, res, next) => {
  Sekretariat.find({ rodzajTowaru: req.params.sekretrType }).then(documents => {
    res.status(200).json({
      message: 'Sekretariats fetched successfully',
      sekretariats: documents
    });
  });
});

// DELETEING A SEKRETARIAT
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Sekretariat.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Sekretariat deleted' });
  });
});

module.exports = router;
