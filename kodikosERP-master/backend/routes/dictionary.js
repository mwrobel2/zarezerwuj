const express = require('express');
const router = express.Router();
const Dictionary = require('../models/dictionary');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// SAVING A DICTIONARY
// in post 'req' has some data in it
router.post('', ensureAuthenticated, (req, res, next) => {
  // with body-parser I'm getting data of dictionary
  // in req
  const dictionaryBody = req.body;
  // console.log(dictionaryBody);

  // we can instantiate an object from model
  // because model method from dictionary.js gives us an constructor
  const dictionary = new Dictionary(dictionaryBody);
  // console.log(dictionary);
  // zapis do bazy danych
  // nazwa kolekcji brana z modelu - (changed to lowercase and added 's') czyli dictionaries
  dictionary.save().then(createdDictionary => {
    // console.log(createdDictionary);
    // we need to set response becouse we should know the status
    res.status(201).json({
      message: 'Dictionary added successfully.',
      dictionaryId: createdDictionary._id
    });
  });
});

// UPDATE A DICTIONARY
// I can use put or patch
router.put('/:id', ensureAuthenticated, (req, res, next) => {
  // I'm creating a new dictionary object to store it in database
  const dictionary = new Dictionary(req.body);
  // because with new Dictionary a new _id is crated I have to
  // set _id to the old value in other case update will fail
  dictionary._id = req.params.id;
  Dictionary.updateOne({ _id: req.params.id }, dictionary).then(result => {
    // console.log(result);
    res.status(200).json({ message: 'Dictionary updated.' });
  });
});

// READING ALL DICTIONARIES
// we are adding middleware
// before (req,res,next) we can add as many filters as we want
// req is empty in get requests
router.get('', ensureAuthenticated, (req, res, next) => {
  // zwracam napis
  // res.send('Hello from express');

  // I'm getting data from the database
  Dictionary.find().then(documents => {
    // console.log(documents);
    //zwracam json data
    res.status(200).json({
      message: 'Dictionary fetched successfully',
      dictionaries: documents
    });
  });
});

// GET SINGLE DICTIONARY
router.get('/:id', ensureAuthenticated, (req, res, next) => {
  Dictionary.findById(req.params.id).then(dictionary => {
    if (dictionary) {
      res.status(200).json(dictionary);
    } else {
      res.status(404).json({ message: 'Dictionary not found.' });
    }
  });
});

//GET DICTIONARY BY NAME
router.get('/name/:name', ensureAuthenticated, (req, res, next) => {
  Dictionary.findOne({ name: req.params.name }).then(dictionary => {
    if (dictionary) {
      res.status(200).json(dictionary);
    } else {
      res.status(404).json({ message: 'Dictionary not found.' });
    }
  });
});

// DELETEING A DICTIONARY
router.delete('/:id', ensureAuthenticated, (req, res, next) => {
  // console.log(req.params.id);
  Dictionary.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Dictionary deleted' });
  });
});

module.exports = router;
