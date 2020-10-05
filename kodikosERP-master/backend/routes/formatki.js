const express = require('express');
const router = express.Router();
const Formatka = require('../models/formatka');
// const checkAuth = require('../middleware/check-auth');
const { ensureAuthenticated } = require('../middleware/ensureAuth');

// UPDATE A FORMATKA ;-)
router.put('/:id', ensureAuthenticated, (req, res, next) => {
  const formatka = new Formatka(req.body);

  if (req.params.id === '1') {
    formatka.save().then(createdFormatka => {
      res.status(201).json({
        message: 'Formatka added successfully.',
        formatkaId: createdFormatka._id
      });
    });
  } else {
    formatka._id = req.params.id;
    // TEGO NIE WOLNO LOGOWAĆ !!!!! BO SIĘ WYPIERDALA
    // console.log(fromatka);
    Formatka.updateOne({ _id: req.params.id }, formatka).then(result => {
      res.status(200).json({ message: 'Form fields updated.' });
    });
  }
});

// GET FORMATKA BY NAME
router.get('/name/:name', ensureAuthenticated, (req, res, next) => {
  Formatka.findOne({ name: req.params.name })
    .then(document => {
      if (document) {
        res.status(200).json({
          message: 'Formatka returned successfully',
          document: document
        });
      } else {
        res.status(404).json({
          message: 'Formatka not found'
        });
      }

    });
});

module.exports = router;
