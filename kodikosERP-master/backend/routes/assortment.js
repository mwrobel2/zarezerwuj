const express = require('express');
const router = express.Router();
const Assortment = require('../models/assortment');
const checkAssortmentExists = require('../middleware/check-assortment-exitsts');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING AN ASSORTMENT
router.post('', ensureAuthenticated, checkAssortmentExists,   (req, res, next) => {
  const url = req.protocol + '://' + req.get('host') + '/';
  const assortmentBody = req.body;
  assortmentBody.addBy = {};
  assortmentBody.modBy = {};
  assortmentBody.addDate = new Date();
  assortmentBody.modDate = assortmentBody.addDate;

  assortmentBody.addBy.login = req.user.login;
  assortmentBody.addBy.name = req.user.name;
  assortmentBody.addBy.surname = req.user.surname;
  assortmentBody.addBy.email = req.user.email;
  assortmentBody.modBy.login = req.user.login;
  assortmentBody.modBy.name = req.user.name;
  assortmentBody.modBy.surname = req.user.surname;
  assortmentBody.modBy.email = req.user.email;
  assortmentBody.accountManager = req.user.name + ' ' + req.user.surname;
  assortmentBody.accountManagerLogin = req.user.login;

  const assortment = new Assortment(assortmentBody);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli assortments
  assortment.save().then(createdAssortment => {
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Assortment added successfully.',
      assortmentId: createdAssortment._id,
    });
  });
});



// UPDATE AN ASSORTMENT
// I can use put or patch
router.put('/:id', ensureAuthenticated,(req, res, next) => {
  // I'm creating a new assortment object to store it in database
  const assortment = new Assortment(req.body);
  assortment.modDate = new Date();
  assortment.modBy.login = req.user.login;
  assortment.modBy.name = req.user.name;
  assortment.modBy.surname = req.user.surname;
  assortment.modBy.email = req.user.email;
  // because with new Assortment a new _id is crated I have to
  // set _id to the old value in other case update will fail
  assortment._id = req.params.id;
  Assortment.updateOne({ _id: req.params.id }, assortment).then(result => {
    res.status(200).json({ message: 'Assortment updated.' });
  });
});



// READING ALL ASSORTMENTS
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // dla paginacji sprawdzam query parameters
  const pageSize = +req.query.pagesize;
  let currentPage = +req.query.page;
  const fname = req.query.fname;
  const name = req.query.name;
  const accountManagerLogin = req.query.accountManagerLogin;
  const comments = req.query.comments;
  let assortmentsQuery = '';
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
    // assortmentsQuery = Assortment.find(selector);
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

  assortmentsQuery = Assortment.find(selector).sort({ "modDate": -1 });

  let fetchedAssortments;
  if (pageSize && currentPage) {
    assortmentsQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // I'm getting data from the database
  assortmentsQuery.then(documents => {
    fetchedAssortments = documents;

    //zwracam liczbę dokumentow
    if (fname != null) {
      return Object.keys(documents).length;
    } else {
      return Assortment.countDocuments();
    }
  })
    .then(count => {
      res.status(200).json({
        message: 'Assortments fetched successfully',
        assortments: fetchedAssortments,
        maxAssortments: count,
      });
    });
});

// GET SINGLE ASSORTMENT
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  // console.log('decodedSingle', req.decoded);
  Assortment.findById(req.params.id).then(assortment => {
    if (assortment) {
      res.status(200).json({ assortment: assortment });
    } else {
      res.status(404).json({ message: 'Assortment not found.' });
    }
  });
});

// GET ASSORTMENTS BY TYPE
router.get('/type/:assortType', ensureAuthenticated, (req, res, next) => {
  Assortment.find({ rodzajTowaru: req.params.assortType }).then(documents => {
    res.status(200).json({
      message: 'Assortments fetched successfully',
      assortments: documents
    });
  });
});

// DELETEING A ASSORTMENT
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  Assortment.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: 'Assortment deleted' });
  });
});

module.exports = router;
